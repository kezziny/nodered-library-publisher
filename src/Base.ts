import { Argument, ArgumentMap } from './Argument';

export class Base {
  init(args: { [id: string]: any } = {}) {
    for (const key in this) {
      if (this[key] instanceof Argument || this[key] instanceof ArgumentMap) {
        (this[key] as Argument).field = key;
        this[key] = (this[key] as Argument).eval(args[key], this);
      }
    }
  }
}
