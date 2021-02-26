/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import 'reflect-metadata';
import Events from 'events';
import { Server } from 'http';
import { Argv } from 'yargs';
import { Logger } from '@ynn/common';
import { VariadicClass } from '@ynn/utility-types';
import Context, { ContextOptions } from './context';
import { ActionInfo } from './action';
import Router, { RouterRule } from './router';
import { DebugOptions } from './debug';
interface Providers {
    [key: string]: unknown;
}
export interface Options {
    root?: string;
    controllers?: Record<string, VariadicClass>;
    providers?: Providers;
    routers?: RouterRule[] | ((this: Application, router: Router, app: Application) => void);
    logger?: Logger;
    debug?: Logger;
    debugOptions?: DebugOptions;
    debugging?: boolean;
    proxy?: boolean;
    maxIpsCount?: number;
}
export default class Application extends Events {
    #private;
    static cargs: {
        [x: string]: unknown;
        _: (string | number)[];
        $0: string;
    };
    options: Readonly<Options>;
    debug: Logger;
    logger: Logger;
    router: Router;
    proxy: boolean;
    controllers: Record<string, VariadicClass>;
    debugging: boolean | string[];
    logging: boolean | string[];
    maxIpsCount: number;
    server?: Server;
    /**
     * require.main is undefined is such as interactive mode
     */
    root: string;
    /**
     * map for actions
     */
    actions: Record<string, Record<string, {
        info: ActionInfo;
        executor: (ctx: Context) => unknown;
    }>>;
    protected parseCargs(cargs: Argv['argv']): Partial<Options>;
    constructor(options?: Readonly<Options>);
    handle(context: ContextOptions | Context): Promise<Context>;
    listen(...args: Parameters<Server['listen']>): Server;
    toJSON(): Record<string, unknown>;
}
export {};
