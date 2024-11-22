import React from 'react';
import { getConnection } from './connection-pool'
import { ChangeNotification, ChangeNotificationOp, ControlSignalNotification, ReloadHeader, ReloadHeaderOp, ReloadItem, ReloadItemOp } from './unpacked-generated';
import murmurhash from 'murmurhash';

interface Props {
  /** Url of the SignalR endpoint */
  url: string,

  /** Query ID to subscribe to */
  queryId: string,
  onReloadItem?: (item: any) => void,

  /** Callback for change notifications */
  onChange?: (event: ChangeNotification) => void,

  /** Callback for control signal notifications */
  onControlSignal?: (event: ControlSignalNotification) => void,

  /** Disable automatic reload */
  noReload?: boolean,

  /** Ignore delete notifications */
  ignoreDeletes?: boolean,

  /** Sort items by a function */
  sortBy?: (item: any) => any,

  /** Reverse the order of items */
  reverse?: boolean
}

export default class DrasiResult extends React.Component<Props> {
  mounted: boolean;
  sigRConn: any;
  needsReload: boolean;
  onUpdate: (item: any) => Promise<void>;
  state: { data: Map<number, any>, seq?: number } = { data: new Map() };

  constructor(props: Props) {
    super(props);
    this.mounted = false;
    this.sigRConn = getConnection(props.url);
    this.needsReload = !(props.noReload);
    let self = this;

    this.onUpdate = async (item: ChangeNotification | ControlSignalNotification) => {
      if (item.seq) {
        self.state.seq = item.seq;
      }

      switch (item.op) {
        case 'i':
          if (item.payload.after) {
            self.state.data.set(hash(item.payload.after), item.payload.after);
          }
          if (self.props.onChange)
            self.props.onChange(item);
          break;
        case 'u':
          self.state.data.delete(getExistingKey(item));
          if (item.payload.after) {
            self.state.data.set(hash(item.payload.after), item.payload.after);
          }
          if (self.props.onChange)
            self.props.onChange(item);
          break;
        case 'd':
          if (self.props.ignoreDeletes)
            return;
          self.state.data.delete(getExistingKey(item));
          if (self.props.onChange)
            self.props.onChange(item);
          break;
        case 'x':
          switch (item.payload.kind) {
            case 'deleted':
              self.state.data.clear();
              break;
          }
          if (self.props.onControlSignal)
            self.props.onControlSignal(item);
          break;
      }

      if (self.mounted) {
        self.setState({
          data: self.state.data,
          seq: self.state.seq
        });
      }
    };
  }

  componentDidMount() {
    let self = this;
    this.sigRConn.started
      .then(() => {
        self.sigRConn.connection.on(self.props.queryId, self.onUpdate);
        if (self.needsReload) {
          self.reload();
          self.needsReload = false;
        }
      });
    this.mounted = true;
  }

  reload() {
    let self = this;
    this.sigRConn.connection.stream("reload", this.props.queryId)
      .subscribe({
        next: async (item: ReloadHeader | ReloadItem) => {
          switch (item.op) {
            case ReloadHeaderOp.H:
              self.state.data = new Map();
              self.state.seq = item.seq;
              break;
            case ReloadItemOp.R:
              if (item.payload.after) {
                self.state.data.set(hash(item.payload.after), item.payload.after);
                if (self.props.onReloadItem) {
                  self.props.onReloadItem(item.payload.after);
                }
              }
              break;
          }
        },
        complete: () => {
          if (self.mounted) {
            self.setState({
              data: self.state.data,
              seq: self.state.seq
            });
          }
        },
        error: (err: any) => console.error(self.props.queryId + ": " + err)
      });
  }

  componentWillUnmount() {
    this.sigRConn.connection.off(this.props.queryId, this.onUpdate);
    this.mounted = false;
  }

  render() {
    let self = this;
    let keys: number[] = [];
    for (let k of this.state.data.keys()) {
      keys.push(k);
    }

    if (self.props.sortBy) {
      let sortFn = self.props.sortBy;
      keys = keys.sort((a, b) => {
        let aVal = sortFn(self.state.data.get(a));
        let bVal = sortFn(self.state.data.get(b));
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
    }

    if (self.props.reverse)
      keys.reverse();

    let listItems: any[] = [];
    for (let k of keys) {
      let item = self.state.data.get(k);

      if (typeof self.props.children === 'function') {
        listItems.push(React.createElement(React.Fragment, {
          key: k,
        },
          self.props.children(item)
        ));
      }
      else {
        listItems.push(React.createElement(React.Fragment, {
          key: k,
        },
          React.Children.map(self.props.children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                key: k,
                ...item
              });
            }
            return child;
          }
          )));
      }
    }
    return listItems;
  }
}

function getExistingKey(item: ChangeNotification | ReloadItem): number {
  if ((item.op == ChangeNotificationOp.D || item.op == ChangeNotificationOp.U) && item.payload.before) {
    return hash(item.payload.before);
  }
  if (item.payload.after) {
    return hash(item.payload.after);
  }
  return 0;
}

function hash(item: { [key: string]: any }): number {
  return murmurhash.v3(JSON.stringify(item));
}