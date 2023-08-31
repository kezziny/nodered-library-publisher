import { Stream, Subscriber } from "./Stream";

export class Generator<Source, U> extends Stream<U> {
    private _source: Stream<Source> = null;

    constructor(source: Stream<Source> = null) {
        super();
        this._source = source;
    }

    public publish(value: U) {

    }
}