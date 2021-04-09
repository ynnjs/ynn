/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: helpers/create-context.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/04/2021
 * Description:
 ******************************************************************/

import { Context, ContextOptions } from '../../src';

export function createContext(
    request?: Readonly<Partial<ContextOptions[ 'request' ]>>,
    response?: Readonly<Partial<ContextOptions[ 'response' ]>>
): Context {
    return new Context( {
        request : {
            url : '/',
            method : 'GET',
            ...request
        },
        response : { ...response }
    } );
}
