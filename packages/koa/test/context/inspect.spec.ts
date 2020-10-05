/******************************************************************
 * Copyright ( C ) 2020 LvChengbin
 * 
 * File: context/inspect.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/05/2020
 * Description: 
 ******************************************************************/

import util from 'util';
import assert from 'assert';
import context from '../helpers/context';
import prototype from '../../src/context';

describe( 'ctx.inspect()', () => {
  it( 'should return a json representation', () => {
    const ctx = context();
    const toJSON = ctx.toJSON( ctx );

    assert.deepEqual( toJSON, ctx.inspect() );
    assert.deepEqual( util.inspect( toJSON ), util.inspect( ctx ) );
  });

  // console.log( require.cache ) will call prototype.inspect()
  it( 'should not crash when called on the prototype', () => {
    assert.deepEqual( prototype, prototype.inspect() );
    assert.deepEqual( util.inspect( prototype.inspect() ), util.inspect( prototype ) );
  });
});
