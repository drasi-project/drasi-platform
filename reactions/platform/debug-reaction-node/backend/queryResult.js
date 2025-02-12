class QueryResult {
  constructor(queryContainerId) {
    this.fieldNames = new Set();
    this.data = new Set();
    this.errors = [];
    this.queryContainerId = queryContainerId;
    this.comparer = EntryComparer();
  }

  onPropertyChanged(callback) {
    this.propertyChanged = callback;
  }

  add(item) {
    console.log(`Adding ${JSON.stringify(item)}`);
    const entry = this.flatten(item);
    this.mergeFieldNames(entry);
    const hash = this.EntryComparer.getHashCode(entry);
    this.data.add(hash);
    this.notifyPropertyChanged('data');
  }

  update(before, after, groupingKeys) {
    console.log(`Updating from ${JSON.stringify(before)} to ${JSON.stringify(after)}`);
    const entryBefore = this.flatten(before);
    const entryAfter = this.flatten(after);
    this.mergeFieldNames(entryAfter);
    this.data.delete(JSON.stringify(entryBefore));

    if (groupingKeys) {
      if (Array.isArray(groupingKeys)) {
        const keys = groupingKeys.map(key => key.toString());
        for (const item of [...this.data]) {
          const parsedItem = JSON.parse(item);
          let match = true;
          for (const key of keys) {
            if (!(key in parsedItem) || !(key in entryAfter) || parsedItem[key] !== entryAfter[key]) {
              match = false;
              break;
            }
          }
          if (match) {
            this.data.delete(item);
          }
        }
      }
    }

    this.data.add(JSON.stringify(entryAfter));
  }

  delete(item) {
    console.log(`Delete ${JSON.stringify(item)}`);
    
    const entryBefore = this.flatten(item);
    this.data.delete(JSON.stringify(entryBefore));
  }

  clear() {
    this.data.clear();
  }

  flatten(item) {
    const result = {};
    if (typeof item !== 'object' || item === null) {
      return result;
    }

    for (const [key, value] of Object.entries(item)) {
      result[key] = String(value);
    }

    return result;
  }

  mergeFieldNames(item) {
    for (const key of Object.keys(item)) {
      if (!this.fieldNames.has(key)) {
        this.fieldNames.add(key);
        this.notifyPropertyChanged('fieldNames');
      }
    }
  }
}


class EntryComparer {
  equals(x, y) {
    return this.getHashCode(x) === this.getHashCode(y);
  }

  getHashCode(obj) {
    let result = 1;

    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        result *= this.hashCode(k) + this.hashCode(v);
      }
    }

    return result;
  }

  hashCode(value) {
    if (value == null) return 0;
    if (typeof value === 'string') {
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
      }
      return hash;
    }
    return Number(value);
  }
}