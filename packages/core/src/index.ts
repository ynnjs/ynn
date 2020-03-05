/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: index.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 03/05/2020
 * Description: 
 ******************************************************************/

import Koa from 'koa';

class Ynn extends Koa {
    constructor( options = {} ) {
        super( options() );
    }
}

module.exports = Ynn;
