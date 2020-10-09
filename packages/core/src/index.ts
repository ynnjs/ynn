/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: index.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/05/2020
 * Description: 
 ******************************************************************/

import Koa from '@ynn/koa';
import cargs from 'cargs';

export type YnnOptions = {
    debugging?: boolean;
    logging?: boolean;
    'config-dir'?: string;
    'log-path'?: string;
    logger?: string | boolean;
}

export default class Ynn extends Koa {
    public static cargs = cargs;

    constructor( options: YnnOptions ) {
        super();
    }
}

export default Ynn;
