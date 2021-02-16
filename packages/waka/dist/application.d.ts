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
export interface Options {
    root?: string;
    controllers?: Record<string, VariadicClass>;
    providers?: Record<string, unknown>;
    routers?: RouterRule[] | ((this: Application, router: Router, app: Application) => void);
    port?: number;
}
export default class Application extends Events {
    #private;
    options: Readonly<Options>;
    debug?: Logger;
    router: Router;
    controllers: Record<string, VariadicClass<[Context]>>;
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
}
