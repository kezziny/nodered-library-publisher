export type EventCallback<T> = (T: any) => void;
export declare class Event<T> {
    private subscribers;
    on(callback: EventCallback<T>): void;
    off(callback: EventCallback<T>): void;
    trigger(data: T): void;
}
