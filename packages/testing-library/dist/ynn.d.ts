/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description:
 ******************************************************************/
import Ynn, { Options, Context, ContextOptions } from '@ynn/core';
export declare function createContext(request?: Readonly<Partial<ContextOptions['request']>>, response?: Readonly<Partial<ContextOptions['response']>>): Context;
export declare function createApp(options: Options): Ynn;
export declare function createAppWithRequest(options: Options | Ynn, context: Context | ContextOptions): Promise<Context>;
