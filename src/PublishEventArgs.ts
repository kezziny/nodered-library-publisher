export interface ValueAtDate<T> {
    value: T,
    at: Date
}

export class PublishEventArgs<T> {
    public from: ValueAtDate<T>;
    public to:ValueAtDate<T>;

    public get value():T {
        return this.to.value;
    }

    public constructor(from: ValueAtDate<T>, to: ValueAtDate<T>) {
        this.from = from;
        this.to = to;
    }
}