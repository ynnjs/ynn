/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File：extensions.js
 * Author ：LvChengbin<lvchengbin59@gmail.com>
 * Time ：02/13/2020
 * Description ：
 ******************************************************************/

const Ynn = require( '../../../../' );

module.exports = {
    E1 : class extends Ynn.Extension {},
    E2 : function() {
        return class extends Ynn.Extension{}
    },
    E3 : './extensions/e3',
    E4 : {
        path : './extensions/e4',
        options : {
            name : '$e4'
        }
    },
    E5 : './extensions/e5',
    E6 : './extensions/e6'
};
