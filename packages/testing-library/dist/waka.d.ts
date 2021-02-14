/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description:
 ******************************************************************/
import Waka, { Options, Context, ContextOptions } from '@ynn/waka';
export declare function createContext(request?: Readonly<Partial<ContextOptions['request']>>, response?: Readonly<Partial<ContextOptions['response']>>): Context;
export declare function createApp(options: Options): Waka;
export declare function createAppWithRequest(options: Options | Waka, context: Context | ContextOptions): Promise<Context>;
