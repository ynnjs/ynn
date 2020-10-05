/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: application/inspect.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/06/2020
 * Description: 
 ******************************************************************/


import util from 'util';
import assert from 'assert';
import Koa from '../../src/application';

const app = new Koa();

describe( 'app.inspect()', () => {
    it( 'should work', () => {
        const str = util.inspect( app );
        assert.equal( '{ subdomainOffset: 2, proxy: false, env: \'test\' }', str );
    } );

    it( 'should return a json representation', () => {
        assert.deepEqual( { subdomainOffset: 2, proxy: false, env: 'test' }, app.inspect() );
    } );
} );
