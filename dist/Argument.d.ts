export declare namespace Args {
    interface Tmp {
        id: string;
    }
}
export interface ArgumentSettings {
    required?: boolean;
    default?: any;
    type?: any;
    min?: number;
    max?: number;
    array?: boolean;
    arraySizeMin?: number;
    arraySizeMax?: number;
}
export declare class Argument {
    field: string;
    schema: ArgumentSettings;
    constructor(schema: ArgumentSettings, field?: string);
    eval(data: any, context?: {}): any;
    validateElement(data: any): void;
}
export declare class ArgumentMap {
    schema: {
        [key: string]: Argument;
    };
    constructor(schema: {
        [key: string]: ArgumentSettings | Argument | ArgumentMap;
    });
    eval(data: any): {};
}
