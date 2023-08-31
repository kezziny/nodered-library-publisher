import {PublishEventArgs} from "./PublishEventArgs";
import { IPublisher } from "./IPublisher";

export type Subscriber<T> = (value: T) => void

export class Stream<T> implements IPublisher<T> {
    private _onNext:Subscriber<T>[] = [];
    private _onEmpty:(() => void)[] = [];
    private _onError:((error: Error) => void)[] = [];
    private _value:T = undefined;

    public get value() { return this._value; }

    public publish(value:T | Error):void {
        if (value instanceof Error) {
            for(let subscriber of this._onError) {
                subscriber(value);
            }
        } else if (value === undefined || value === null) {
            this._value = value;
            for(let subscriber of this._onEmpty) {
                subscriber();
            }
        } else {
            this._value = value;
            for(let subscriber of this._onNext) {
                subscriber(value);
            }
        }
    }

    public subscribe(subscriber: Subscriber<T>) {
        this._onNext.push(subscriber);
    }

    public onError(subscriber: (error: Error) => void) {
        this._onError.push(subscriber);
    }

    public onEmpty(subscriber: () => void) {
        this._onEmpty.push(subscriber);
    }

    private _changed: Stream<T> = null;
    public changed(): Stream<T> {
        if (this._changed === null) {
            this._changed = this.createStream<T>();
            this._changed.publish(this._value);
            this.subscribe(value => {
                if (value !== this._changed.value) {
                    this._changed.publish(value);
                }
            });
        }

        return this._changed;
    }

    public switchIfEmpty(value: T | (() => T)): Stream<T> {
        let publisher = this.createStream<T>();
        this.subscribe(v => publisher.publish(v));
        this.onError(e => publisher.publish(e));
        this.onEmpty(() => {
            if (this.isCallback<() => T>(value)) {
                publisher.publish(value());
            } else {
                publisher.publish(value);
            }
        })
        return publisher;
    }

    public map<U>(transformation: ((value: T) => U)): Stream<U> {
        let publisher = this.createStream<U>();
        this.subscribe(event => {
            publisher.publish(transformation(event));
        });
        return publisher;
    }

    public filter(filter: ((value: T) => Boolean)): Stream<T> {
        let publisher = this.createStream<T>();
        this.subscribe(value => {
            if (filter(value))
                publisher.publish(value);
        });
        return publisher;
    }

    public noPublishSince(ms: number): Stream<T> {
        let publisher = this.createStream<T>();
        let timeout = null;
        this.subscribe(value => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                publisher.publish(value);
            }, ms);
        });
        return publisher;
    }

    public static of<T>(...streams: Stream<T>[]):Stream<T> {
        let publisher = new Stream<T>();
        streams.forEach(s => s.subscribe(value => publisher.publish(value)));
        return publisher;
    }

    public static ofMap<T>(map: { [key: string]: Stream<T> }): Stream<{ [key: string]: T }> {
        let publisher = new Stream<{[key: string]: T}>();
        for (let key in map) {
            map[key].subscribe(event => {
                let value = {};
                for (let k in map) {
                    value[k] = map[k].value;
                }
                publisher.publish(value);
            });
        }

        return publisher;
    }

    public static ofArray<T>(...streams: Stream<T>[]): Stream<T[]> {
        let publisher = new Stream<T[]>();
        streams.forEach(s => s.subscribe(event => publisher.publish(streams.map(s => s.value))));
        return publisher;
    }

    public static mergeConditionally<T>(...streams: { if: Stream<boolean>, then: Stream<T> }[]): Stream<T[]> {
        let publisher = new Stream<T[]>();
        Stream.of<any>(...streams.map(s => s.if).concat(streams.map(s => s.then as Stream<any>)))
            .subscribe(() => {
                publisher.publish(streams.filter(s => s.if.value).map(s => s.then.value));
            });
        return publisher;
    }

    protected createStream<Target>(): Stream<Target> {
        return new Stream<Target>();
    }

    private isCallback<T>(source: T | unknown): source is T {
        return typeof source === 'function';
      }
}