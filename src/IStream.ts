export interface IStream<T> {
    publish(data: T);
    changed(): IStream<T>;
    switchIfEmpty(value: T | (() => T)): IStream<T>;
    map<U>(transformation: ((value: T) => U)): IStream<U>;
    filter(filter: ((value: T) => Boolean)): IStream<T>;
    noPublishSince(ms: number): IStream<T>;
}