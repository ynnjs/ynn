/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/controller.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/16/2020
 * Description: 
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import assert, { Assertion } from '@ynn/http-assert';
import Ynn from './ynn';

export type ControllerOptions = {
};

export default class Controller {

    public app: Ynn;

    constructor( public ctx: KoaContext, options: ControllerOptions = {} ) {
        const { app } = ctx.app;
        this.app = app;
        this.logger = app.logger;
    }

    throw( ...args ) {
        return this.ctx.throw( ...args );
    }

    async response( data: any, type, options = {} ) {
        const { ctx } = this;
        ctx.body = data;
    }

    config() {
        return this.app.config( ...arguments );
    }

    assert( value: any, ...args ): Assertion {
        return assert( value, ...args );
    }
}
