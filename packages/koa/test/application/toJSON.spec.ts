/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 *
 * File: application/toJSON.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description:
 ******************************************************************/

import assert from 'assert';
import Koa from '../../src/application';

describe( 'app.toJSON()', () => {
    it( 'should work', () => {
        const app = new Koa();
        const obj = app.toJSON();

        assert.deepEqual( {
            subdomainOffset : 2,
            proxy : false,
            env : 'test'
        }, obj );
    } );
} );
