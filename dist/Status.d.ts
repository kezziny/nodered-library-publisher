import { Event } from './Event';
type StatusMessage = {
    shape: '' | 'dot' | 'ring';
    fill: '' | 'green' | 'red' | 'yellow';
    text: string;
};
export declare class Status {
    private _value;
    changed: Event<StatusMessage>;
    get value(): StatusMessage;
    set(value: StatusMessage): void;
    green(text?: string): void;
    yellow(text?: string): void;
    red(text?: string): void;
    clear(): void;
}
export {};
