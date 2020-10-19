/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/
export declare type Status = number;
export declare type Message = Error | string;
export declare type Opts = Record<string, any>;
export declare type HttpErrorArgs<S = Status, M = Message, O = Opts> = [] | [S | M | O] | [S | M, O] | [S, M | O] | [S, M, O];
export declare class Assertion {
    #private;
    constructor(value: any, ...args: HttpErrorArgs);
    default(value?: any): this;
    set(value: any): this;
    value(): any;
    required(status?: number, message?: string | undefined): this;
    /**
     * alias for integer
     */
    int(transform?: boolean, ...args: HttpErrorArgs): this;
    integer(transform?: boolean, ...args: HttpErrorArgs): this;
    number(...args: HttpErrorArgs): this;
    url(...args: HttpErrorArgs): this;
    date(): void;
    /**
     * YYYY-MM-DD HH:mm:ss
     */
    time(): void;
    dateTime(...args: HttpErrorArgs): this;
    timestamp(): void;
    gt(n: number, ...args: HttpErrorArgs): this;
    gte(n: number, ...args: HttpErrorArgs): this;
    lt(n: number, ...args: HttpErrorArgs): this;
    lte(n: number, ...args: HttpErrorArgs): this;
    between(lower: number, upper: number, ...args: HttpErrorArgs): this;
    in(list: any[], ...args: HttpErrorArgs): this;
    strictIn(list: any[], ...args: HttpErrorArgs): this;
    notIn(list: any[], ...args: HttpErrorArgs): this;
    strictNotIn(list: any[], ...args: HttpErrorArgs): this;
    length(range: number | [number, number], ...args: HttpErrorArgs): this;
    regex(reg: RegExp, ...args: HttpErrorArgs): this;
    equal(x: unknown, ...args: HttpErrorArgs): this;
    notEqual(x: unknown, ...args: HttpErrorArgs): this;
    strictEqual(x: unknown, ...args: HttpErrorArgs): this;
    notStrictEqual(x: unknown, ...args: HttpErrorArgs): this;
    deepEqual(x: unknown, ...args: HttpErrorArgs): this;
    notDeepEqual(x: unknown, ...args: HttpErrorArgs): this;
    jsonstring(mutate?: boolean, ...args: HttpErrorArgs): this;
    json(type?: string, mutate?: boolean, ...args: HttpErrorArgs): this;
    object(...args: HttpErrorArgs): this;
    array(...args: HttpErrorArgs): this;
    custom(fn: (...x: any[]) => any, ...args: HttpErrorArgs): this;
    skip(): this;
    assert(x: boolean, ...args: HttpErrorArgs): this;
    throw(...args: HttpErrorArgs): void;
}
export default function assert(value: any, ...args: HttpErrorArgs): Assertion;
