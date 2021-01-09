/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: koa/.eslintrc.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/29/2020
 * Description: 
 ******************************************************************/

module.exports = {
    parser : '@typescript-eslint/parser',
    plugins : [ '@typescript-eslint', '@ynn' ],
    extends : [
        'plugin:@ynn/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions : {
        sourceType : 'module',
        ecmaVersion : 2021
    },
    root : true,
    env : {
        es6 : true,
        jest : true,
        node : true
    }
}
