/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/controller.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description:
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import assert from '@ynn/http-assert';
import Ynn from './ynn';
import Logger from './interfaces/logger.interface';

export type ControllerOptions = {
};

export default class Controller {

    public app: Ynn;

    public logger: Logger;

    public assert = assert;

    constructor( public ctx: KoaContext ) {
        const { app } = ctx;
        this.app = app;
        this.logger = app.logger;

        this.config = app.config.bind( app );
    }

    throw( ...args ) {
        return this.ctx.throw( ...args );
    }

    config( ...args ) {
        return this.ctx.app.config( ...args );
    }

    // provider( name: string ) {
    //     return this.ctx.app.providers[ name ];
    // }

    async response( data: any, type, options = {} ) {
        const { ctx } = this;
        ctx.body = data;
        console.log( options );
    }
}
