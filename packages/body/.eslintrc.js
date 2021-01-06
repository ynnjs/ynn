/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: body/.eslintrc.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/05/2021
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
};
