/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/02/2020
 * Description:
 ******************************************************************/
import Cookies from 'cookies';
import { KoaRequest } from './request';
import { KoaResponse } from './response';
declare const COOKIES: unique symbol;
export interface KoaContext {
    request?: KoaRequest;
    response?: KoaResponse;
    [COOKIES]?: Cookies;
    [key: string]: any;
}
declare const context: KoaContext;
export default context;
