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

class Ynn extends Koa {
    public static cargs = cargs;

    constructor() {
        super();
    }
}

export default Ynn;
