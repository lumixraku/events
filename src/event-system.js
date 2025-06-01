// 通用事件对象
export class Event {
  constructor(type, target, data) {
    this.type = type;
    this.target = target;
    this.data = data;
    this.cancelBubble = false;
  }

  stopPropagation() {
    this.cancelBubble = true;
  }
}

// 事件管理器
export class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(node, type, callback) {
    if (!this.listeners.has(node)) {
      this.listeners.set(node, {});
    }
    if (!this.listeners.get(node)[type]) {
      this.listeners.get(node)[type] = [];
    }
    this.listeners.get(node)[type].push(callback);
  }

  dispatchEvent(event) {
    let currentNode = event.target;
    while (currentNode && !event.cancelBubble) {
      const listeners = this.listeners.get(currentNode)?.[event.type];
      if (listeners) {
        for (const callback of listeners) {
          callback(event);
          if (event.cancelBubble) break;
        }
      }
      currentNode = currentNode.parent;
    }
  }
}

export const globalEventManager = new EventManager();