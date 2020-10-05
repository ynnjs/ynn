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
    plugins : [ '@typescript-eslint/eslint-plugin' ],
    extends : [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    globals : {
        Buffer : true,
        process : true
    },
    parserOptions : {
        sourceType : 'module',
        ecmaVersion : 2020
    },
    root : true,
    env : {
        jest : true,
        node : true
    },
    rules : {
        '@typescript-eslint/explicit-module-boundary-types' : 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/adjacent-overload-signatures' : 'off',
        '@typescript-eslint/type-annotation-spacing' : 'off',
        '@typescript-eslint/triple-slash-reference' : 'off',
        '@typescript-eslint/no-non-null-assertion' : 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-array-constructor' : 'off',
        '@typescript-eslint/class-name-casing' : 'off',
        '@typescript-eslint/no-empty-function' : 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/camelcase' : 'off',
        'react/jsx-no-target-blank' : 'off',
        'prefer-rest-params' : 'off',
        'prefer-const' : 'off',
        'prefer-spread' : 'off',
        'no-console' : 'off',
        'no-empty' : [ 'error' ],
        'linebreak-style': [ 'error', 'unix' ],
        'no-use-before-define' : [ 'error' ],
        'no-undef' : [ 'error' ],
        quotes : [ 'error', 'single' ],
        semi : [ 0 ]
    }
}
