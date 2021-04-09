/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/debug.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/
import { StyleOptions } from 'cli-style';
import { Logger } from './interfaces';
declare type OptionsStyles = Record<keyof Logger, StyleOptions>;
declare type Messages = [any, ...any[]];
export declare type DebugOptions = {
    levels?: ( keyof Logger )[] | boolean;
    styles?: Partial<OptionsStyles> | false;
};
export default class Debug implements Logger {
    #private;
    private static print;
    static log( style: StyleOptions, ...args: Messages ): void;
    static error( style: StyleOptions, ...args: Messages ): void;
    static warn( style: StyleOptions, ...args: Messages ): void;
    static debug( style: StyleOptions, ...args: Messages ): void;
    constructor( options?: DebugOptions );
    log( ...args: Messages ): void;
    error( ...args: Messages ): void;
    warn( ...args: Messages ): void;
    debug( ...args: Messages ): void;
}
export {};
