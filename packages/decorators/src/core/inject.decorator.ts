/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: core/inject.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/04/2021
 * Description:
 ******************************************************************/

import { INJECTABLE_METADATA_KEY, CommonParameterMetadata, Scope } from '@ynn/common';

export type InjectToken = string | number | symbol;

export interface InjectOptions {
    token?: InjectToken;
    params?: unknown[];
    scope?: Scope;
}

// export function Inject( token?: InjectToken | InjectOptions ): ParameterDecorator & MethodDecorator {

//     if( !token ) {
//     } else {
//         if( [ 'string', 'symbol', 'number' ].includes( typeof token ) ) {
//         }
//     }
// }
