import { Base } from './Base';
import { Argument } from './Argument';
import { Status } from './Status';

export class Node extends Base {
  public readonly status: Status = new Status();

  private node: any = new Argument({ required: true });
  private debugMode: boolean | any = new Argument({
    required: true,
    default: false,
  });

  init(args: Node.Args.Init) {
    super.init(args);
    this.node.on('close', () => this.destructor());
    this.status.changed.on((status) => this.node.status(status));
  }

  debug(object) {
    if (this.debugMode) this.node.warn({ object });
  }

  warning(object) {
    this.node.warn({ object });
  }

  error(object) {
    this.node.error({ object });
  }

  destructor(){}
}

export namespace Node {
  export namespace Args {
    export interface Init {
      node: any;
      debugMode?: boolean;
    }
  }
}
