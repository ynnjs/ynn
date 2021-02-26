"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: configs/eslint-recommended.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/
module.exports = {
    overrides: [{
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2021
            },
            env: { es6: true, jest: true, node: true },
            reportUnusedDisableDirectives: true,
            rules: {
                // Posible Errors
                'for-direction': 'error',
                'getter-return': 'error',
                'no-async-promise-executor': 'error',
                'no-await-in-loop': 'error',
                'no-compare-neg-zero': 'error',
                'no-cond-assign': 'error',
                'no-console': 'error',
                'no-constant-condition': 'error',
                'no-control-regex': 'error',
                'no-debugger': 'error',
                'no-dupe-args': 'error',
                'no-dupe-else-if': 'error',
                'no-dupe-keys': 'error',
                'no-empty': 'error',
                'no-empty-character-class': 'error',
                'no-ex-assign': 'error',
                'no-extra-boolean-cast': 'error',
                'no-extra-semi': 'error',
                'no-func-assign': 'error',
                'no-import-assign': 'error',
                'no-inner-declarations': 'error',
                'no-invalid-regexp': 'error',
                'no-irregular-whitespace': 'error',
                'no-misleading-character-class': 'error',
                'no-obj-calls': 'error',
                'no-promise-executor-return': 'error',
                'no-prototype-builtins': 'error',
                'no-regex-spaces': 'error',
                'no-setter-return': 'error',
                'no-sparse-arrays': 'error',
                'no-template-curly-in-string': 'error',
                'no-unexpected-multiline': 'error',
                'no-unreachable': 'error',
                'no-unsafe-finally': 'error',
                'no-unsafe-negation': 'error',
                'no-useless-backreference': 'error',
                'use-isnan': 'error',
                'valid-typeof': 'error',
                // Best Practices
                'block-scoped-var': 'error',
                'class-methods-use-this': 'error',
                'default-param-last': 'error',
                'dot-notation': 'error',
                'no-case-declarations': 'error',
                'no-else-return': 'error',
                'no-empty-function': 'error',
                'no-empty-pattern': 'error',
                'no-eq-null': 'error',
                'no-extend-native': 'error',
                'no-fallthrough': 'error',
                'no-global-assign': 'error',
                'no-multi-spaces': 'error',
                'no-multi-str': 'error',
                'no-octal': 'error',
                'no-redeclare': 'error',
                'no-return-await': 'error',
                'no-self-assign': 'error',
                'no-self-compare': 'error',
                'no-throw-literal': 'error',
                'no-unused-expressions': ['error', {
                        allowShortCircuit: true,
                        allowTernary: true,
                        allowTaggedTemplates: true
                    }],
                'no-unused-labels': 'error',
                'no-useless-catch': 'error',
                'no-useless-escape': 'error',
                'no-warning-comments': ['error', { terms: ['@todo', '@bug'], location: 'start' }],
                'no-with': 'error',
                'vars-on-top': 'error',
                'wrap-iife': 'error',
                yoda: ['error', 'never', { exceptRange: false }],
                // Variables
                'no-delete-var': 'error',
                'no-shadow-restricted-names': 'error',
                'no-undef': 'error',
                'no-unused-vars': 'error',
                'no-use-before-define': ['error', { functions: false, classes: false }],
                // Stylistic Issues
                'array-bracket-spacing': ['error', 'always'],
                'block-spacing': ['error', 'always'],
                'brace-style': ['error', '1tbs', { allowSingleLine: true }],
                'comma-spacing': ['error', { before: false, after: true }],
                'comma-style': ['error', 'last'],
                'computed-property-spacing': ['error', 'always'],
                'func-call-spacing': ['error', 'never'],
                'implicit-arrow-linebreak': ['error', 'beside'],
                'indent': ['error', 4, { SwitchCase: 1 }],
                'jsx-quotes': ['error', 'prefer-double'],
                'key-spacing': ['error', { beforeColon: true, afterColon: true }],
                'keyword-spacing': ['error', {
                        before: true,
                        after: true,
                        overrides: {
                            if: { after: false },
                            for: { after: false },
                            while: { after: false },
                            switch: { after: false },
                            catch: { after: false }
                        }
                    }],
                'linebreak-style': ['error', 'unix'],
                'lines-between-class-members': ['error', 'always', {
                        exceptAfterSingleLine: true
                    }],
                'no-mixed-spaces-and-tabs': 'error',
                'no-multi-assign': 'error',
                'no-multiple-empty-lines': 'error',
                'no-tabs': 'error',
                'no-trailing-spaces': 'error',
                'no-whitespace-before-property': 'error',
                'object-curly-spacing': ['error', 'always'],
                'quotes': ['error', 'single'],
                'semi': ['error', 'always', { omitLastInOneLineBlock: true }],
                'space-before-blocks': 'error',
                'space-before-function-paren': ['error', {
                        anonymous: 'never',
                        named: 'never',
                        asyncArrow: 'always'
                    }],
                'space-in-parens': ['error', 'always'],
                'space-infix-ops': 'error',
                'space-unary-ops': ['error', { words: true, nonwords: false }],
                'spaced-comment': ['error', 'always', { exceptions: ['+', '-', '*'] }],
                'switch-colon-spacing': ['error', { after: true, before: true }],
                'template-tag-spacing': ['error', 'never'],
                'unicode-bom': ['error', 'never'],
                // EcmaScript 6
                'arrow-spacing': ['error', { before: true, after: true }],
                'constructor-super': 'error',
                'no-class-assign': 'error',
                'no-dupe-class-members': 'error',
                'no-new-symbol': 'error',
                'no-this-before-super': 'error',
                'require-yield': 'error',
                'rest-spread-spacing': ['error', 'never'],
                'symbol-description': 'error'
            }
        }]
};
