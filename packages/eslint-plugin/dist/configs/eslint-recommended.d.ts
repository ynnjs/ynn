/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: configs/eslint-recommended.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/
declare const _default: {
    overrides: {
        files: string[];
        parserOptions: {
            sourceType: string;
            ecmaVersion: number;
        };
        env: {
            es6: boolean;
            jest: boolean;
            node: boolean;
        };
        reportUnusedDisableDirectives: boolean;
        rules: {
            'for-direction': string;
            'getter-return': string;
            'no-async-promise-executor': string;
            'no-await-in-loop': string;
            'no-compare-neg-zero': string;
            'no-cond-assign': string;
            'no-console': string;
            'no-constant-condition': string;
            'no-control-regex': string;
            'no-debugger': string;
            'no-dupe-args': string;
            'no-dupe-else-if': string;
            'no-dupe-keys': string;
            'no-empty': string;
            'no-empty-character-class': string;
            'no-ex-assign': string;
            'no-extra-boolean-cast': string;
            'no-extra-semi': string;
            'no-func-assign': string;
            'no-import-assign': string;
            'no-inner-declarations': string;
            'no-invalid-regexp': string;
            'no-irregular-whitespace': string;
            'no-misleading-character-class': string;
            'no-obj-calls': string;
            'no-promise-executor-return': string;
            'no-prototype-builtins': string;
            'no-regex-spaces': string;
            'no-setter-return': string;
            'no-sparse-arrays': string;
            'no-template-curly-in-string': string;
            'no-unexpected-multiline': string;
            'no-unreachable': string;
            'no-unsafe-finally': string;
            'no-unsafe-negation': string;
            'no-useless-backreference': string;
            'use-isnan': string;
            'valid-typeof': string;
            'block-scoped-var': string;
            'class-methods-use-this': string;
            'default-param-last': string;
            'dot-notation': string;
            'no-case-declarations': string;
            'no-else-return': string;
            'no-empty-function': string;
            'no-empty-pattern': string;
            'no-eq-null': string;
            'no-extend-native': string;
            'no-fallthrough': string;
            'no-global-assign': string;
            'no-multi-spaces': string;
            'no-multi-str': string;
            'no-octal': string;
            'no-redeclare': string;
            'no-return-await': string;
            'no-self-assign': string;
            'no-self-compare': string;
            'no-throw-literal': string;
            'no-unused-expressions': (string | {
                allowShortCircuit: boolean;
                allowTernary: boolean;
                allowTaggedTemplates: boolean;
            })[];
            'no-unused-labels': string;
            'no-useless-catch': string;
            'no-useless-escape': string;
            'no-warning-comments': (string | {
                terms: string[];
                location: string;
            })[];
            'no-with': string;
            'vars-on-top': string;
            'wrap-iife': string;
            yoda: (string | {
                exceptRange: boolean;
            })[];
            'no-delete-var': string;
            'no-shadow-restricted-names': string;
            'no-undef': string;
            'no-unused-vars': string;
            'no-use-before-define': (string | {
                functions: boolean;
                classes: boolean;
            })[];
            'array-bracket-spacing': string[];
            'block-spacing': string[];
            'brace-style': (string | {
                allowSingleLine: boolean;
            })[];
            'comma-spacing': (string | {
                before: boolean;
                after: boolean;
            })[];
            'comma-style': string[];
            'computed-property-spacing': string[];
            'func-call-spacing': string[];
            'implicit-arrow-linebreak': string[];
            indent: (string | number | {
                SwitchCase: number;
            })[];
            'jsx-quotes': string[];
            'key-spacing': (string | {
                beforeColon: boolean;
                afterColon: boolean;
            })[];
            'keyword-spacing': (string | {
                before: boolean;
                after: boolean;
                overrides: {
                    if: {
                        after: boolean;
                    };
                    for: {
                        after: boolean;
                    };
                    while: {
                        after: boolean;
                    };
                    switch: {
                        after: boolean;
                    };
                    catch: {
                        after: boolean;
                    };
                };
            })[];
            'linebreak-style': string[];
            'lines-between-class-members': (string | {
                exceptAfterSingleLine: boolean;
            })[];
            'no-mixed-spaces-and-tabs': string;
            'no-multi-assign': string;
            'no-multiple-empty-lines': string;
            'no-tabs': string;
            'no-trailing-spaces': string;
            'no-whitespace-before-property': string;
            'object-curly-spacing': string[];
            quotes: string[];
            semi: (string | {
                omitLastInOneLineBlock: boolean;
            })[];
            'space-before-blocks': string;
            'space-before-function-paren': (string | {
                anonymous: string;
                named: string;
                asyncArrow: string;
            })[];
            'space-in-parens': string[];
            'space-infix-ops': string;
            'space-unary-ops': (string | {
                words: boolean;
                nonwords: boolean;
            })[];
            'spaced-comment': (string | {
                exceptions: string[];
            })[];
            'switch-colon-spacing': (string | {
                after: boolean;
                before: boolean;
            })[];
            'template-tag-spacing': string[];
            'unicode-bom': string[];
            'arrow-spacing': (string | {
                before: boolean;
                after: boolean;
            })[];
            'constructor-super': string;
            'no-class-assign': string;
            'no-dupe-class-members': string;
            'no-new-symbol': string;
            'no-this-before-super': string;
            'require-yield': string;
            'rest-spread-spacing': string[];
            'symbol-description': string;
        };
    }[];
};
export = _default;
