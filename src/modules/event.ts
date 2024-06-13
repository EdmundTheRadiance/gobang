import { EventName } from "../typings/index";

const eventHub: { [key in EventName] ? : Function[] } = {};
const mod = {
  on(name: EventName, handler: Function): void {
    eventHub[name] = (eventHub[name] || []).concat(handler);
  },
  off(name: EventName, handler: Function): void {
    const index = (eventHub[name] || []).findIndex(f => f === handler);
    if (index !== -1) {
      eventHub[name]?.splice(index, 1);
    }
  },
  trigger(name: EventName, ...args: unknown[]) {
    const handlers = eventHub[name];
    if (!handlers || !handlers.length) {
      return;
    }
    for (let i = 0; i < handlers.length; i++) {
      handlers[i](...args);
    }
  }
}

export default mod;
debugger;
(window as any).eventHub = mod;
