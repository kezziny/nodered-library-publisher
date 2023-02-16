"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyGroup = exports.Property = void 0;
const Event_1 = require("./Event");
const Status_1 = require("./Status");
class Property {
    get value() {
        return this._value;
    }
    constructor(metadata = {}) {
        this.status = new Status_1.Status();
        this._value = null;
        this.metadata = {};
        this.changed = new Event_1.Event();
        this.updated = new Event_1.Event();
        this.requested = new Event_1.Event();
        this.metadata = metadata;
        this.changed.on((data) => this.onChanged(data));
    }
    command(value) {
        this.requested.trigger(value);
    }
    set value(value) {
        const oldValue = this.value;
        if (this.value !== value) {
            this.value = value;
            try {
                this.changed.trigger({ source: this, from: oldValue, to: value });
            }
            catch (e) {
            }
        }
        this.updated.trigger({ source: this, from: oldValue, to: value });
    }
    onChanged(data) {
        this.status.green('' + data.to);
    }
}
exports.Property = Property;
class PropertyGroup extends Property {
    constructor(properties = {}) {
        super();
        this.debounceMillis = 50;
        this.debounceTimer = null;
        for (const key in properties) {
            this.add(key, properties[key]);
        }
    }
    add(name, property) {
        this[name] = property;
        property.updated.on((_) => this.updated.trigger({ source: this, from: this.value, to: this.value }));
        property.changed.on((data) => {
            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                const newValue = Object.assign({}, this.value);
                newValue[name] = data.to;
                this.value = newValue;
            }, this.debounceMillis);
        });
    }
    onChanged(data) {
        this.status.green();
    }
}
exports.PropertyGroup = PropertyGroup;
//# sourceMappingURL=Property.js.map