/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: configs/recommended.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/

export = {
    // parser : '@typescript-eslint-parser',
    plugins : [ '@typescript-eslint' ],
    extends : [
        './configs/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions : {
        sourceType : 'module',
        ecmaVersion : 2021
    },
    rules : {}
}
