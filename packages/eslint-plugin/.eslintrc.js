/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: eslint-plugin/.eslintrc.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/04/2021
 * Description:
 ******************************************************************/

const eslintRecommended = require( './dist/index' ).configs[ 'eslint-recommended' ];

module.exports = {
    parser : '@typescript-eslint/parser',
    plugins : [ '@typescript-eslint' ],
    extends : [
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
    },
    rules : {
        ...eslintRecommended.overrides[ 0 ].rules,
        '@typescript-eslint/explicit-module-boundary-types' : 'off',
        '@typescript-eslint/explicit-function-return-type' : 'off',
        '@typescript-eslint/adjacent-overload-signatures' : 'off',
        '@typescript-eslint/type-annotation-spacing' : 'off',
        '@typescript-eslint/triple-slash-reference' : 'off',
        '@typescript-eslint/no-non-null-assertion' : 'off',
        '@typescript-eslint/interface-name-prefix' : 'off',
        '@typescript-eslint/no-array-constructor' : 'off',
        '@typescript-eslint/class-name-casing' : 'off',
        '@typescript-eslint/no-empty-function' : 'off',
        '@typescript-eslint/no-explicit-any' : 'off',
        '@typescript-eslint/camelcase' : 'off'
    }
};
