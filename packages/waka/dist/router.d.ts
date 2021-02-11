/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/router.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/31/2021
 * Description:
 ******************************************************************/
import { ParseOptions } from 'path-to-regexp';
import { Shift } from '@ynn/utility-types';
import Context from './context';
export declare type Pattern = string | RegExp | (string | RegExp)[] | {
    pattern: string | RegExp | (string | RegExp)[];
    options: ParseOptions;
};
export interface RouteMap {
    module?: string;
    controller?: string;
    action?: string;
    path?: string;
}
export declare type RouterHandler = (this: Router, ctx: Context, params: Record<string, string>, matches: string[]) => RouteMap | string | Promise<RouteMap | string> | void;
export declare type RouterRule = [
    methods: string | string[],
    pattern: Pattern,
    dest: RouterHandler | RouterHandler[] | RouteMap | string
];
export interface MatchResult {
    params: Readonly<Record<string, string>>;
    matches: string[];
}
export default class Router {
    rules: RouterRule[];
    get(...args: Shift<RouterRule>): void;
    post(...args: Shift<RouterRule>): void;
    put(...args: Shift<RouterRule>): void;
    head(...args: Shift<RouterRule>): void;
    patch(...args: Shift<RouterRule>): void;
    delete(...args: Shift<RouterRule>): void;
    options(...args: Shift<RouterRule>): void;
    any(...args: RouterRule): void;
    match(context: Readonly<Context>): false | (MatchResult & {
        rule: RouterRule;
    });
}
