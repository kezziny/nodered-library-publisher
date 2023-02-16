import { Event } from './Event';

type StatusMessage = {
  shape: '' | 'dot' | 'ring';
  fill: '' | 'green' | 'red' | 'yellow';
  text: string;
};

export class Status {
  private _value: StatusMessage = { shape: 'dot', fill: 'green', text: '' };
  public changed: Event<StatusMessage> = new Event();

  public get value() {
    return this._value;
  }

  public set(value: StatusMessage) {
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
