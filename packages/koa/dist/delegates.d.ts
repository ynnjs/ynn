/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/delegates.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/03/2020
 * Description:
 ******************************************************************/
export default class Delegates {
    #private;
    proto: unknown;
    target: string;
    constructor(proto: unknown, target: string);
    method(name: string): this;
    access(name: string): this;
    getter(name: string): this;
    setter(name: string): this;
    methods(...names: string[]): this;
    accesses(...names: string[]): this;
    getters(...names: string[]): this;
    setters(...names: string[]): this;
}
