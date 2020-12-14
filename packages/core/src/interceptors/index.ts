/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: request-interceptor/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/05/2020
 * Description: 
 ******************************************************************/

import { RequestInterceptor } from '../interface/interceptor.interface';
import body from './body';

export const requestInterceptors: Record<string, RequestInterceptor> = {
    body
};
