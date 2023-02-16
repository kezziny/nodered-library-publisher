"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const Argument_1 = require("./Argument");
class Base {
    init(args = {}) {
        for (const key in this) {
            if (this[key] instanceof Argument_1.Argument || this[key] instanceof Argument_1.ArgumentMap) {
                this[key].field = key;
                this[key] = this[key].eval(args[key], this);
            }
        }
    }
}
exports.Base = Base;
//# sourceMappingURL=Base.js.map