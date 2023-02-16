"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const Event_1 = require("./Event");
class Status {
    constructor() {
        this._value = { shape: 'dot', fill: 'green', text: '' };
        this.changed = new Event_1.Event();
    }
    get value() {
        return this._value;
    }
    set(value) {
        this._value = value;
        this.changed.trigger(value);
    }
    green(text = '') {
        this.set({ shape: 'dot', fill: 'green', text: text });
    }
    yellow(text = '') {
        this.set({ shape: 'dot', fill: 'yellow', text: text });
    }
    red(text = '') {
        this.set({ shape: 'ring', fill: 'red', text: text });
    }
    clear() {
        this.set({ shape: '', fill: '', text: '' });
    }
}
exports.Status = Status;
//# sourceMappingURL=Status.js.map