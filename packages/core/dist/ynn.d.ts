/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/28/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import 'reflect-metadata';
import Events from 'events';
import { Server } from 'http';
import { Argv } from 'yargs';
import { VariadicClass } from '@ynn/utility-types';
import { Context, ContextOptions } from './context';
import { Executor } from './action';
import { Router, RouterRule } from './router';
import { Logger } from './interfaces';
import { DebugOptions } from './debug';
declare type Controllers = Record<string, VariadicClass>;
export declare type ModuleOverrideOptions = Omit<Options, 'controllers' | 'modules'> & {
    controllers?: Controllers | ( ( controllers: Controllers | undefined ) => Controllers );
    modules?: Modules | ( ( modules: Modules | undefined ) => Modules );
};
export interface ModuleDescriptor {
    module: VariadicClass;
    options: ModuleOverrideOptions;
}
declare type Modules = Record<string, VariadicClass | ModuleDescriptor>;
export interface Options {
    controllers?: Controllers;
    modules?: Modules;
    routers?: RouterRule[] | ( ( this: Ynn, router: Router, app: Ynn ) => void );
    logger?: Logger;
    debug?: Logger;
    debugOptions?: DebugOptions;
    debugging?: boolean | ( keyof Logger )[];
    logging?: boolean | ( keyof Logger )[];
    proxy?: boolean;
    maxIpsCount?: number;
    module?: VariadicClass;
    mountingPath?: Ynn[];
}
export declare class Ynn extends Events {
    #private;
    static cargs: {
        [x: string]: unknown;
        _: ( string | number )[];
        $0: string;
    };

    static create( moduleOrDescriptor: VariadicClass | ModuleDescriptor, options?: ModuleOverrideOptions ): Ynn;
    options: Readonly<Options>;
    debug: Logger;
    logger: Logger;
    router: Router;
    proxy: boolean;
    controllers: Record<string, VariadicClass>;
    modules: Record<string, Ynn>;
    debugging: boolean | ( keyof Logger )[];
    logging: boolean | ( keyof Logger )[];
    maxIpsCount: number;
    mountingPath: Ynn[];
    /**
     * The related Module of current application instance.
     * only instances built on Modules have this property.
     */
    module?: VariadicClass;
    server?: Server;
    /**
     * require.main is undefined in for example interactive mode.
     */
    root: string;
    /**
     * map for action executors
     */
    executors: Record<string, Record<string, Executor>>;
    protected parseCargs( cargs: Argv['argv'] ): Partial<Options>;
    constructor( options?: Readonly<Options> );
    handle( context: ContextOptions | Context ): Promise<Context>;
    listen( ...args: Parameters<Server['listen']> ): Server;
    toJSON(): Record<string, unknown>;
}
export {};
