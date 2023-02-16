"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentMap = exports.Argument = void 0;
class Argument {
    constructor(schema, field = "Data") {
        this.field = field;
        this.schema = Object.assign({
            required: false,
            default: undefined,
            type: undefined,
            min: undefined,
            max: undefined,
            array: false,
            arraySizeMin: undefined,
            arraySizeMax: undefined,
        }, schema);
    }
    eval(data, context = {}) {
        if (data === undefined && this.schema.default !== undefined) {
            if (typeof this.schema.default === 'function') {
                data = this.schema.default(context);
            }
            else {
                data = this.schema.default;
            }
        }
        if ((data === undefined || data === null) && this.schema.required) {
            throw new Error(`${this.field} is required`);
        }
        if (this.schema.array) {
            if (!Array.isArray(data)) {
                throw new Error(`${this.field} must be type of array`);
            }
            if (this.schema.arraySizeMin && data.length < this.schema.arraySizeMin) {
                throw new Error(`${this.field} array must have at least ${this.schema.arraySizeMin} element`);
            }
            if (this.schema.arraySizeMax && data.length > this.schema.arraySizeMax) {
                throw new Error(`${this.field} array must have at most ${this.schema.arraySizeMax} element`);
            }
            data.forEach((value, index) => {
                try {
                    this.validateElement(value);
                }
                catch (e) {
                    throw new Error(`${this.field} array element #${index}: ${e.message}`);
                }
            });
        }
        else {
            if (data !== undefined) {
                this.validateElement(data);
            }
        }
        return data;
    }
    validateElement(data) {
        if (this.schema.type === undefined)
            return;
        if (!(typeof this.schema.type === 'string')) {
            if (!(data instanceof this.schema.type)) {
                throw new Error(`${this.field} must be instance of ` +
                    this.schema.type.prototype.constructor.name);
            }
        }
        else
            switch (this.schema.type) {
                case 'text':
                case 'string': {
                    if (typeof data !== 'string') {
                        throw new Error(`${this.field} must be type of string`);
                    }
                    break;
                }
                case 'number': {
                    if (typeof data !== 'number') {
                        throw new Error(`${this.field} must be type of number`);
                    }
                    if (this.schema.min && data < this.schema.min) {
                        throw new Error(`${this.field} must be at least ` + this.schema.min);
                    }
                    if (this.schema.max && data > this.schema.max) {
                        throw new Error(`${this.field} must be at most ` + this.schema.max);
                    }
                    break;
                }
                case 'bool':
                case 'boolean': {
                    if (typeof data !== 'boolean') {
                        throw new Error(`${this.field} must be type of boolean`);
                    }
                    break;
                }
                default: {
                    const options = this.schema.type.split('|');
                    if (!options.find((o) => o === data)) {
                        throw new Error(`${this.field} (${data}) must be type of string and one of the following options: ${options}`);
                    }
                }
            }
    }
}
exports.Argument = Argument;
class ArgumentMap {
    constructor(schema) {
        for (const key in schema) {
            if (schema[key] instanceof Argument || schema[key] instanceof ArgumentMap)
                continue;
            schema[key] = new Argument(schema[key], key);
        }
        this.schema = schema;
    }
    eval(data) {
        if (data === undefined || data === null) {
            data = {};
        }
        const result = {};
        if (typeof data !== 'object') {
            throw new Error('Data should be type of map');
        }
        Object.getOwnPropertyNames(this.schema).forEach((key) => {
            if (typeof this.schema[key].schema.default === 'function')
                return;
            try {
                result[key] = this.schema[key].eval(data[key]);
            }
            catch (e) {
                throw new Error(`Field '${key}': ${e.message}`);
            }
        });
        Object.getOwnPropertyNames(this.schema).forEach((key) => {
            if (typeof this.schema[key].schema.default !== 'function')
                return;
            try {
                result[key] = this.schema[key].eval(data[key], result);
            }
            catch (e) {
                throw new Error(`Field '${key}': ${e.message}`);
            }
        });
        return result;
    }
}
exports.ArgumentMap = ArgumentMap;
//# sourceMappingURL=Argument.js.map