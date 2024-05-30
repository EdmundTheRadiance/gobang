import { EventName } from "../typings/index";

const eventHub: { [key in EventName] ? : Function[] } = {};
export default {
    on(name: EventName, handler: Function): void {
        eventHub[name] = (eventHub[name] || []).concat(handler);
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