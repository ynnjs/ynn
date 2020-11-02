/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: test/router.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/02/2020
 * Description: 
 ******************************************************************/

import Koa, { compose } from '@ynn/koa';
import Router from '../src/router';

describe( 'Router', () => {
    

    describe( 'Router.match', () => {
        it( '', () => {
            Router.match( 'a' );
        } ); 
    } );
} );
