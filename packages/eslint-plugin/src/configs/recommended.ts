/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: configs/recommended.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/

import path from 'path';
import findup from 'find-up';

const tsconfig = findup.sync( [ 'tsconfig.eslint.json', 'tsconfig.lint.json', 'tsconfig.json' ] );

export = {
    extends : [ path.join( __dirname, 'eslint-recommended' ) ],
    overrides : [ {
        files : [ '*.ts', '*.tsx' ],
        parser : '@typescript-eslint/parser',
        plugins : [ '@typescript-eslint' ],
        extends : [
            'plugin:@typescript-eslint/recommended',
            path.join( __dirname, 'eslint-recommended' )
        ],
        parserOptions : {
            sourceType : 'module',
            ecmaVersion : 2021,
            project : tsconfig,
            createDefaultProgram : true,
            ecmaFeatures : {
                jsx : true
            }
        },
        settings : {
            react : {
                version : 'detect'
            }
        },
        rules : {
            'brace-style' : 'off', // use @typescript-eslint/brace-style
            'comma-dangle' : 'off', // use @typescript-eslint/comma-dangle
            'comma-spacing' : 'off', // use @typescript-eslint/comma-spacing
            'default-param-last' : 'off', // use @typescript-eslint/default-param-last
            'dot-notation' : 'off', // use @typescript-eslint/dot-notation
            'func-call-spacing' : 'off', // use @typescript-eslint/func-call-spacing
            'keyword-spacing' : 'off', // use @typescript-eslint/keyword-spacing
            'lines-between-class-members' : 'off', // use @typescript-eslint/lines-between-class-members
            'no-dup-class-members' : 'off', // use @typescript-eslint/no-dup-class-members
            'no-duplicate-imports' : 'off', // use @typescript-eslint/no-duplicate-imports
            'no-redeclare' : 'off', // use @typescript-eslint/no-redclare
            'no-throw-literal' : 'off', // use @typescript-eslint/no-throw-literal
            'no-unused-expressions' : 'off', // use @typescript-eslint/no-unused-expressions
            'no-unused-vars' : 'off', // use @typescrpt-eslint/no-unused-vars
            'no-use-before-define' : 'off', // use @typescrpt-eslint/no-use-before-define
            'no-empty-function' : 'off', // use @typescript-eslint/no-empty-function
            'no-extra-semi' : 'off', // use @typescript-eslint/no-extra-semi
            '@typescript-eslint/array-type' : [ 'error', { default : 'array', readonly : 'array' } ],
            '@typescript-eslint/explicit-function-return-type' : [ 'error' ],
            '@typescript-eslint/member-delimiter-style' : [ 'error', {
                multiline : { delimiter : 'semi', requireLast : true },
                singleline : { delimiter : 'semi', requireLast : false }
            } ],
            '@typescript-eslint/member-ordering' : [ 'error', {
                default : [ 'field', 'signature', 'constructor', 'method' ],
                classes : [
                    'private-static-field',
                    'public-static-field',
                    'private-static-method',
                    'public-static-method',
                    'private-instance-field',
                    'public-instance-field',
                    'constructor',
                    'private-instance-method',
                    'public-instance-method'
                ]
            } ],
            '@typescript-eslint/method-signature-style' : [ 'error', 'property' ],
            '@typescript-eslint/naming-convention' : [ 'error', {
                format : [ 'camelCase', 'PascalCase', 'UPPER_CASE' ],
                selector : [ 'variable', 'function' ]
            } ],
            '@typescript-eslint/no-confusing-non-null-assertion' : [ 'error' ],
            '@typescript-eslint/no-confusing-void-expression' : [ 'error' ],
            '@typescript-eslint/no-dynamic-delete' : [ 'error' ],
            '@typescript-eslint/no-empty-interface' : [ 'error', { allowSingleExtends : true } ],
            '@typescript-eslint/no-floating-promises' : [ 'error' ],
            '@typescript-eslint/no-for-in-array' : [ 'error' ],
            '@typescript-eslint/no-implicit-any-catch' : [ 'error' ],
            '@typescript-eslint/no-require-imports' : [ 'error' ],
            '@typescript-eslint/no-unnecessary-boolean-literal-compare' : [ 'error' ],
            '@typescript-eslint/no-unnecessary-condition' : [ 'error' ],
            '@typescript-eslint/no-unnecessary-qualifier' : [ 'error' ],
            '@typescript-eslint/no-unnecessary-type-constraint' : [ 'error' ],
            '@typescript-eslint/prefer-nullish-coalescing' : [ 'error' ],
            '@typescript-eslint/prefer-optional-chain' : [ 'error' ],
            '@typescript-eslint/prefer-reduce-type-parameter' : [ 'error' ],
            '@typescript-eslint/prefer-string-starts-ends-with' : [ 'error' ],
            '@typescript-eslint/prefer-ts-expect-error' : [ 'error' ],
            '@typescript-eslint/promise-function-async' : [ 'error' ],
            '@typescript-eslint/switch-exhaustiveness-check' : [ 'error' ],
            '@typescript-eslint/type-annotation-spacing' : [ 'error', {
                before : false,
                after : true,
                overrides : {
                    arrow : { before : true, after : true }
                }
            } ],
            '@typescript-eslint/unified-signatures' : [ 'error' ],
            '@typescript-eslint/brace-style' : [ 'error', '1tbs', { allowSingleLine : true } ],
            '@typescript-eslint/comma-dangle' : [ 'error' ],
            '@typescript-eslint/comma-spacing' : [ 'error', { before : false, after : true } ],
            '@typescript-eslint/default-param-last' : [ 'error' ],
            '@typescript-eslint/dot-notation' : [ 'error' ],
            '@typescript-eslint/func-call-spacing' : [ 'error', 'never' ],
            '@typescript-eslint/keyword-spacing' : [ 'error', {
                before : true,
                after : true,
                overrides : {
                    if : { after : false },
                    for : { after : false },
                    while : { after : false },
                    switch : { after : false },
                    catch : { after : false }
                }
            } ],
            '@typescript-eslint/lines-between-class-members' : [ 'error' ],
            '@typescript-eslint/no-dupe-class-members' : [ 'error' ],
            '@typescript-eslint/no-duplicate-imports' : [ 'error' ],
            '@typescript-eslint/no-redeclare' : [ 'error' ],
            '@typescript-eslint/no-throw-literal' : [ 'error' ],
            '@typescript-eslint/no-unused-expressions' : [ 'error', {
                allowShortCircuit : true,
                allowTernary : true,
                allowTaggedTemplates : true
            } ],
            '@typescript-eslint/no-unused-vars' : [ 'error' ],
            '@typescript-eslint/no-use-before-define' : [ 'error', { functions : false, classes : false } ]
        }
    }, {
        // fules for testing files
        files : [ '*.spec.ts', '*.spec.js', '*.spec.tsx', '*.spec.jsx', '*.dt.ts' ],
        rules : {
            'class-methods-use-this' : 'off',
            '@typescript-eslint/no-empty-function' : 'off',
            '@typescript-eslint/no-floating-promises' : 'off',
            '@typescript-eslint/explicit-function-return-type' : 'off',
            '@typescript-eslint/no-non-null-assertion' : 'off'
        }
    } ]
}
