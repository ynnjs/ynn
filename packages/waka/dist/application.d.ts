/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/application.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/10/2021
 * Description:
 ******************************************************************/
import 'reflect-metadata';
import { Argv } from 'yargs';
import { VariadicClass } from '@ynn/utility-types';
import Context, { ContextOptions } from './context';
import { ActionInfo } from './action';
import Router, { RouterRule } from './router';
import { Controller } from './interfaces';
export interface Options {
    root?: string;
    controllers?: Record<string, VariadicClass<[Context], Controller>>;
    providers?: Record<string, unknown>;
    routers?: RouterRule[] | ((this: Application, router: Router, app: Application) => void);
}
export default class Application {
    #private;
    options: Readonly<Options>;
    router: Router;
    controllers: Record<string, VariadicClass<[Context]>>;
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
}
