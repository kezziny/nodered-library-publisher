"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const Base_1 = require("./Base");
const Argument_1 = require("./Argument");
const Status_1 = require("./Status");
class Node extends Base_1.Base {
    constructor() {
        super(...arguments);
        this.status = new Status_1.Status();
        this.node = new Argument_1.Argument({ required: true });
        this.debugMode = new Argument_1.Argument({
            required: true,
            default: false,
        });
    }
    init(args) {
        super.init(args);
        this.node.on('close', () => this.destructor());
        this.status.changed.on((status) => this.node.status(status));
    }
    debug(object) {
        if (this.debugMode)
            this.node.warn({ object });
    }
    warning(object) {
        this.node.warn({ object });
    }
    error(object) {
        this.node.error({ object });
    }
    destructor() { }
}
exports.Node = Node;
//# sourceMappingURL=Node.js.map