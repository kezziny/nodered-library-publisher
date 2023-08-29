import {PublishEventArgs} from "./PublishEventArgs";
import { IPublisher } from "./IPublisher";

export type Subscriber<T> = (event: PublishEventArgs<T>) => void;

export class Publisher<T> implements IPublisher<T> {
    private _subscribers:Subscriber<T>[] = [];
    private _value:T = undefined;
    private _since:Date = undefined;

    public get value() { return this._value; }

    public publish(value:T):void {
        let event = new PublishEventArgs<T>(
            {
                value: this._value,
                at: this._since
            },
            {
                value,
                at: new Date()
            }
        );
        this._value = value;
        this._since = event.to.at;

        for(let subscriber of this._subscribers) {
            subscriber(event);
        }
    }

    public then(subscriber: Subscriber<T>): Publisher<T> {
        this._subscribers.push(subscriber);
        return this;
    }

    private _changed: Publisher<T> = null;
    public changed(): Publisher<T> {
        if (this._changed === null) {
            this._changed = new Publisher<T>();
            this._changed.publish(this._value);
            this.then(event => {
                if (event.from.value !== event.to.value) {
                    this._changed.publish(event.value);
                }
            });
        }

        return this._changed;
    }

    public map<U>(transformation: ((data: PublishEventArgs<T>) => U)): Publisher<U> {
        let publisher = new Publisher<U>();
        this.then(event => {
            publisher.publish(transformation(event));
        });
        return publisher;
    }

    public filter(filter: ((data: PublishEventArgs<T>) => Boolean)): Publisher<T> {
        let publisher = new Publisher<T>();
        this.then(event => {
            if (filter(event))
                publisher.publish(event.value);
        });
        return publisher;
    }

    public noPublishSince(ms: number): Publisher<T> {
        let publisher = new Publisher<T>();
        let timeout = null;
        this.then(event => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                publisher.publish(event.value);
            }, ms);
        });
        return publisher;
    }

    public anyOf<U>(filter: ((data: U) => boolean)): Publisher<boolean> {
        let publisher = new Publisher<boolean>();
        this.then(event => {
            if (!(event.value instanceof Array)) throw new Error("Invalid cast");

            if (event.value.some(filter))
                publisher.publish(true);
            else
                publisher.publish(false)
        });

        return publisher;
    }

    public allOf<U>(filter: ((data: U) => boolean)): Publisher<boolean> {
        let publisher = new Publisher<boolean>();
        this.then(event => {
            if (!(event.value instanceof Array)) throw new Error("Invalid cast");

            if (event.value.every(filter))
                publisher.publish(true);
            else
                publisher.publish(false)
        });

        return publisher;
    }

    public noneOf<U>(filter: ((data: U) => boolean)): Publisher<boolean> {
        let publisher = new Publisher<boolean>();
        this.then(event => {
            if (!(event.value instanceof Array)) throw new Error("Invalid cast");

            if (!event.value.some(filter))
                publisher.publish(true);
            else
                publisher.publish(false)
        });

        return publisher;
    }

    public min(fallback: number): Publisher<number> {
        let publisher = new Publisher<number>();
        this.then(event => {
            if (!(event.value instanceof Array)) throw new Error("Invalid cast");

            if (event.value.length === 0 || event.value.every(i => i === null)) {
                return publisher.publish(fallback);
            }

            let min = null;
            for (let i of event.value) {
                if (i === null) continue;
                if (min === null || min > i) min = i;
            }
            publisher.publish(min);
        });

        return publisher;
    }

    public static of<T>(...streams: Publisher<T>[]):Publisher<T> {
        let publisher = new Publisher<T>();
        streams.forEach(s => s.then(event => publisher.publish(event.value)));
        return publisher;
    }

    public static ofMap<T>(map: { [key: string]: Publisher<T> }): Publisher<{ [key: string]: T }> {
        let publisher = new Publisher<{[key: string]: T}>();
        for (let key in map) {
            map[key].then(event => {
                let value = {};
                for (let k in map) {
                    value[k] = map[k].value;
                }
                publisher.publish(value);
            });
        }

        return publisher;
    }

    public static ofArray<T>(...streams: Publisher<T>[]): Publisher<T[]> {
        let publisher = new Publisher<T[]>();
        streams.forEach(s => s.then(event => publisher.publish(streams.map(s => s.value))));
        return publisher;
    }

    public static mergeConditionally<T>(...streams: { if: Publisher<boolean>, then: Publisher<T> }[]): Publisher<T[]> {
        let publisher = new Publisher<T[]>();
        Publisher.of<any>(...streams.map(s => s.if).concat(streams.map(s => s.then as Publisher<any>)))
            .then(() => {
                publisher.publish(streams.filter(s => s.if.value).map(s => s.then.value));
            });
        return publisher;
    }
}