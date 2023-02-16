import { Event } from './Event';
import { Status } from './Status';
export declare class Property<T> {
    status: Status;
    protected _value: T;
    readonly metadata: {
        [id: string]: any;
    };
    get value(): T;
    readonly changed: Event<Property.ChangedEventArgs<T>>;
    readonly updated: Event<Property.ChangedEventArgs<T>>;
    readonly requested: Event<T>;
    constructor(metadata?: {
        [id: string]: any;
    });
    command(value: T): void;
    set value(value: T);
    protected onChanged(data: Property.ChangedEventArgs<T>): void;
}
export declare class PropertyGroup extends Property<{
    [field: string]: any;
}> {
    debounceMillis: number;
    private debounceTimer;
    constructor(properties?: {});
    add(name: any, property: any): void;
    protected onChanged(data: Property.ChangedEventArgs<{
        [field: string]: any;
    }>): void;
}
export declare namespace Property {
    type ChangedEventArgs<T> = {
        source: any;
        from: T;
        to: T;
    };
}
