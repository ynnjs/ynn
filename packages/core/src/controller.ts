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
import Logger from './logger';

export type ControllerOptions = {
};

export default class Controller {

    public app: Ynn;
    public logger: Logger;
    public config: Ynn[ 'config' ];
    public assert = assert;

    constructor( public ctx: KoaContext, options: ControllerOptions = {} ) {
        const { app } = ctx.app;
        this.app = app;
        this.logger = app.logger;

        this.config = app.config.bind( app );
    }

    throw( ...args ) {
        return this.ctx.throw( ...args );
    }

    async response( data: any, type, options = {} ) {
        const { ctx } = this;
        ctx.body = data;
    }
}
