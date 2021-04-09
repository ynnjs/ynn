/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/
import { Key, ParseOptions } from 'path-to-regexp';
import { Shift } from '@ynn/utility-types';
import { Context } from './context';
export declare type Pattern = string | RegExp | ( string | RegExp )[];
export interface RouteMap {
    module?: string;
    controller?: string;
    action?: string;
    path?: string;
}
export declare type RouterHandler = ( ctx: Context, params: Record<string, string>, matches: string[] ) => RouteMap | string | Context | Promise<RouteMap | string | Context> | void;
export declare type RouterRule = [
    methods: string | string[],
    pattern: Pattern,
    dest: RouterHandler | RouteMap | string,
    options?: ParseOptions
];
export interface MatchResult {
    params: Readonly<Record<string, string>>;
    matches: string[];
}
export declare type Matches = MatchResult & {
    rule: RouterRule;
};
export declare class Router {
    #private;
    rules: ( {
        rule: RouterRule;
        keys?: Key[];
        pattern: RegExp;
    } )[];
    get( ...args: Shift<RouterRule> ): void;
    post( ...args: Shift<RouterRule> ): void;
    put( ...args: Shift<RouterRule> ): void;
    head( ...args: Shift<RouterRule> ): void;
    patch( ...args: Shift<RouterRule> ): void;
    delete( ...args: Shift<RouterRule> ): void;
    options( ...args: Shift<RouterRule> ): void;
    any( ...args: RouterRule ): void;
    match( context: Context ): Matches | false;
}
