/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/

import { Log, Logger, Ctx, HttpException, Query, Exception } from '@ynn/common';
import Application, { Action, Context } from '.';

class CatService {
    constructor( @Ctx() ctx: Context ) {
        console.log( ctx );
    }
}

class Controller {
    constructor( @Ctx() public ctx: Context ) {}

    @Exception( function( e ) { console.log( arguments ) } )
    @Action( 'profile' )
    index( @Log() log: Logger, catService: CatService, @Query( 'id' ) id: number ): unknown {

        // console.log( this.ctx );

        console.log( 'catService: ', catService );

        if( !id ) throw new HttpException( {
            status : 400,
            message : [
                'id must be a number'
            ]
        } );

        return { status : 0, id };
    }
}

const app = new Application( {
    controllers : {
        user : Controller
    }
} );

app.listen( 3001 );
