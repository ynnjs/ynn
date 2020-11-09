/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: helpers/ynn.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description: 
 ******************************************************************/

import Ynn from '../../src/ynn';
import { Req, Res } from './koa';
export * from './koa';

export default class extends Ynn {
    $( { req = new Req(), res = new Res() }: { req?: Req, res?: Res } ): Promise<any> {
        return this.callback()( req, res );
    }
}
