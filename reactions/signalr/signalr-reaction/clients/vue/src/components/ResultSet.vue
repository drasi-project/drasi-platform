<script setup>
import { getConnection } from '../connection-pool';
import { ref, onMounted, reactive, defineProps, computed } from 'vue';
import murmurhash from 'murmurhash';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  queryId: {
    type: String,
    required: true,
  },
  ignoreDeletes: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: Function,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  noReload: {
    type: Boolean,
    default: false,
  }
})

const signalr = getConnection(props.url);
let needsReload = !props.noReload;
let seqNum = ref(0);
const data = reactive(new Map());

const dataSorted = computed(() => {
  if (!props.sortBy) {
    return Array.from(data.values());
  }
  let keys = Array.from(data.keys());
  keys = keys.sort((a, b) => {
    let aVal = props.sortBy(data.get(a));
    let bVal = props.sortBy(data.get(b));
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });

  if (props.reverse)
    keys.reverse();

  return keys.map(k => data.get(k));
});

onMounted(() => {
  signalr.started.then(() => {
    signalr.connection.on(props.queryId, onUpdate);
    if (needsReload) {
      reload();
      needsReload = false;
    }
  });
})

function onUpdate(item) {
  if (item.seq) {
    seqNum.value = item.seq;
  }

  switch (item.op) {
    case 'i':
      if (item.payload.after) {
        data.set(hash(item.payload.after), item.payload.after);
      }
      break;
    case 'u':
      data.delete(getExistingKey(item));
      if (item.payload.after) {
        data.set(hash(item.payload.after), item.payload.after);
      }
    case 'd':
      if (props.ignoreDeletes)
        return;
      data.delete(getExistingKey(item));
      break;
    case 'x':
      switch (item.payload.kind) {
        case 'deleted':
          data.clear();
          break;
      }
      break;
  }
}

function reload() {
  signalr.connection.stream("reload", props.queryId)
    .subscribe({
      next: async (item) => {
        switch (item.op) {
          case 'h':
            data.clear();
            seqNum.value = item.seq;
            break;
          case 'r':
            if (item.payload.after) {
              data.set(hash(item.payload.after), item.payload.after);
            }
            break;
        }
      },
      complete: () => {
        console.log("reload complete for query " + props.queryId);
      },
      error: (err) => console.error(props.queryId + ": " + err)
    });
}

function getExistingKey(item) {
  if ((item.op == 'd' || item.op == 'u') && item.payload.before) {
    return hash(item.payload.before);
  }
  if (item.payload.after) {
    return hash(item.payload.after);
  }
  return 0;
}

function hash(item) {
  return murmurhash.v3(JSON.stringify(item));
}

</script>

<template>
  <template v-for="(item, index) in dataSorted" :key="index">
    <slot :item="item" :index="index"></slot>
  </template>
</template>