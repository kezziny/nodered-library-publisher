import { Base } from './Base';
import { Status } from './Status';
export declare class Node extends Base {
    readonly status: Status;
    private node;
    private debugMode;
    init(args: Node.Args.Init): void;
    debug(object: any): void;
    warning(object: any): void;
    error(object: any): void;
    destructor(): void;
}
export declare namespace Node {
    namespace Args {
        interface Init {
            node: any;
            debugMode?: boolean;
        }
    }
}
