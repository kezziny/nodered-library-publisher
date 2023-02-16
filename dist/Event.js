"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor() {
        this.subscribers = [];
    }
    on(callback) {
        this.subscribers.push(callback);
    }
    off(callback) {
    }
    trigger(data) {
        for (const subscriber of this.subscribers) {
            subscriber(data);
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map