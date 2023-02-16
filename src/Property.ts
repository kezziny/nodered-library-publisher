import { Event } from './Event';
import { Status } from './Status';

export class Property<T> {
  public status: Status = new Status();

  protected _value: T = null;
  public readonly metadata: { [id: string]: any } = {};

  public get value() {
    return this._value;
  }

  public readonly changed: Event<Property.ChangedEventArgs<T>> = new Event();
  public readonly updated: Event<Property.ChangedEventArgs<T>> = new Event();
  public readonly requested: Event<T> = new Event();

  constructor(metadata: { [id: string]: any } = {}) {
    this.metadata = metadata;
    this.changed.on((data) => this.onChanged(data));
  }

  public command(value: T) {
    this.requested.trigger(value);
  }

  public set value(value: T) {
    const oldValue = this.value;
    if (this.value !== value) {
      this.value = value;
      try {
        this.changed.trigger({ source: this, from: oldValue, to: value });
      } catch (e) {
        //node.error(e.stack);
      }
    }

    this.updated.trigger({ source: this, from: oldValue, to: value });
  }

  protected onChanged(data: Property.ChangedEventArgs<T>) {
    this.status.green('' + data.to);
  }

  /*syncFrom(property) {
        if (property instanceof Property === false) {
            throw new Error(`Can not sync with object not instance of Property: ${property}`);
        }

        this.on("command", command => property.emit("command", command));
        property.on("changed", data => this.set(data.to));
    }*/
}

export class PropertyGroup extends Property<{ [field: string]: any }> {
  public debounceMillis = 50;
  private debounceTimer = null;

  constructor(properties = {}) {
    super();
    for (const key in properties) {
      this.add(key, properties[key]);
    }
  }

  public add(name, property) {
    this[name] = property;
    property.updated.on((_) =>
      this.updated.trigger({ source: this, from: this.value, to: this.value }),
    );
    property.changed.on((data: Property.ChangedEventArgs<any>) => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const newValue = Object.assign({}, this.value);
        newValue[name] = data.to;
        this.value = newValue;
      }, this.debounceMillis);
    });
  }

  protected onChanged(
    data: Property.ChangedEventArgs<{ [field: string]: any }>,
  ) {
    this.status.green();
  }
}

export namespace Property {
  export type ChangedEventArgs<T> = { source: any; from: T; to: T };
}
