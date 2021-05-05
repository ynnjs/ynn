/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: toThrowHttpException/predicate.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/25/2021
 * Description:
 ******************************************************************/

import deepEqual from 'deep-equal';
import { HttpException } from '@ynn/exceptions';

export default function predicate( received: HttpException, expected: HttpException ): boolean {
    if( !( received instanceof HttpException ) || !( expected instanceof HttpException ) ) return false;
    if( expected.status !== received.status ) return false;
    if( expected.error !== received.error ) return false;
    if( !deepEqual( expected.toJSON(), received.toJSON() ) ) return false;
    return deepEqual( expected.response, received.response );
}
