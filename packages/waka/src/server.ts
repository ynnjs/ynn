/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/server.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/

import { Log, Logger } from '@ynn/common';
import Application, { Action, Context } from '.';

class Controller {
    constructor( public ctx: Context ) {}

    @Action( 'profile' )
    index( @Log() logger: Logger ): unknown {

        // console.log( '-------------------', logger );

        // logger.log( 'Getting user profile...' );
        return {
            status : 0,
            id : this.ctx.query.id
        };
    }
}

const app = new Application( {
    controllers : {
        user : Controller
    }
} );

app.listen( 3000 );
