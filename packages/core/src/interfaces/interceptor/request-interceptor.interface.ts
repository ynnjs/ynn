/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: interceptor/request-interceptor.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/14/2020
 * Description: 
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import Pipe from '../pipe.interface';

export interface RequestInterceptorOptions {
    property?: string | undefined;
    pipe?: Pipe | undefined;
}

export interface RequestInterceptor {
    ( ctx: KoaContext, options: RequestInterceptorOptions ): any;
}
