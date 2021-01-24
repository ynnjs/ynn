/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/
declare const _default: {
    rules: {};
    configs: {
        recommended: {
            extends: string[];
            overrides: ({
                files: string[];
                parser: string;
                plugins: string[];
                extends: string[];
                parserOptions: {
                    sourceType: string;
                    ecmaVersion: number;
                    project: string | undefined;
                    createDefaultProgram: boolean;
                    ecmaFeatures: {
                        jsx: boolean;
                    };
                };
                settings: {
                    react: {
                        version: string;
                    };
                };
                rules: {
                    'brace-style': string;
                    'comma-dangle': string;
                    'comma-spacing': string;
                    'default-param-last': string;
                    'dot-notation': string;
                    'func-call-spacing': string;
                    'keyword-spacing': string;
                    'lines-between-class-members': string;
                    'no-dup-class-members': string;
                    'no-duplicate-imports': string;
                    'no-redeclare': string;
                    'no-throw-literal': string;
                    'no-unused-expressions': string;
                    'no-unused-vars': string;
                    'no-use-before-define': string;
                    'no-empty-function': string;
                    '@typescript-eslint/array-type': (string | {
                        default: string;
                        readonly: string;
                    })[];
                    '@typescript-eslint/explicit-function-return-type': string[];
                    '@typescript-eslint/member-delimiter-style': (string | {
                        multiline: {
                            delimiter: string;
                            requireLast: boolean;
                        };
                        singleline: {
                            delimiter: string;
                            requireLast: boolean;
                        };
                    })[];
                    '@typescript-eslint/member-ordering': (string | {
                        default: string[];
                        classes: string[];
                    })[];
                    '@typescript-eslint/method-signature-style': string[];
                    '@typescript-eslint/naming-convention': (string | {
                        format: string[];
                        selector: string[];
                    })[];
                    '@typescript-eslint/no-confusing-non-null-assertion': string[];
                    '@typescript-eslint/no-confusing-void-expression': string[];
                    '@typescript-eslint/no-dynamic-delete': string[];
                    '@typescript-eslint/no-empty-interface': (string | {
                        allowSingleExtends: boolean;
                    })[];
                    '@typescript-eslint/no-floating-promises': string[];
                    '@typescript-eslint/no-for-in-array': string[];
                    '@typescript-eslint/no-implicit-any-catch': string[];
                    '@typescript-eslint/no-require-imports': string[];
                    '@typescript-eslint/no-unnecessary-boolean-literal-compare': string[];
                    '@typescript-eslint/no-unnecessary-condition': string[];
                    '@typescript-eslint/no-unnecessary-qualifier': string[];
                    '@typescript-eslint/no-unnecessary-type-constraint': string[];
                    '@typescript-eslint/non-nullable-type-assertion-style': string[];
                    '@typescript-eslint/prefer-nullish-coalescing': string[];
                    '@typescript-eslint/prefer-optional-chain': string[];
                    '@typescript-eslint/prefer-reduce-type-parameter': string[];
                    '@typescript-eslint/prefer-string-starts-ends-with': string[];
                    '@typescript-eslint/prefer-ts-expect-error': string[];
                    '@typescript-eslint/promise-function-async': string[];
                    '@typescript-eslint/switch-exhaustiveness-check': string[];
                    '@typescript-eslint/type-annotation-spacing': (string | {
                        before: boolean;
                        after: boolean;
                        overrides: {
                            arrow: {
                                before: boolean;
                                after: boolean;
                            };
                        };
                    })[];
                    '@typescript-eslint/unified-signatures': string[];
                    '@typescript-eslint/brace-style': (string | {
                        allowSingleLine: boolean;
                    })[];
                    '@typescript-eslint/comma-dangle': string[];
                    '@typescript-eslint/comma-spacing': (string | {
                        before: boolean;
                        after: boolean;
                    })[];
                    '@typescript-eslint/default-param-last': string[];
                    '@typescript-eslint/dot-notation': string[];
                    '@typescript-eslint/func-call-spacing': string[];
                    '@typescript-eslint/keyword-spacing': (string | {
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
                    '@typescript-eslint/lines-between-class-members': string[];
                    '@typescript-eslint/no-dupe-class-members': string[];
                    '@typescript-eslint/no-duplicate-imports': string[];
                    '@typescript-eslint/no-redeclare': string[];
                    '@typescript-eslint/no-throw-literal': string[];
                    '@typescript-eslint/no-unused-expressions': (string | {
                        allowShortCircuit: boolean;
                        allowTernary: boolean;
                        allowTaggedTemplates: boolean;
                    })[];
                    '@typescript-eslint/no-unused-vars': string[];
                    '@typescript-eslint/no-use-before-define': (string | {
                        functions: boolean;
                        classes: boolean;
                    })[];
                    'class-methods-use-this'?: undefined;
                    '@typescript-eslint/no-empty-function'?: undefined;
                    '@typescript-eslint/no-non-null-assertion'?: undefined;
                };
            } | {
                files: string[];
                rules: {
                    'class-methods-use-this': string;
                    '@typescript-eslint/no-empty-function': string;
                    '@typescript-eslint/no-floating-promises': string;
                    '@typescript-eslint/explicit-function-return-type': string;
                    '@typescript-eslint/no-non-null-assertion': string;
                    'brace-style'?: undefined;
                    'comma-dangle'?: undefined;
                    'comma-spacing'?: undefined;
                    'default-param-last'?: undefined;
                    'dot-notation'?: undefined;
                    'func-call-spacing'?: undefined;
                    'keyword-spacing'?: undefined;
                    'lines-between-class-members'?: undefined;
                    'no-dup-class-members'?: undefined;
                    'no-duplicate-imports'?: undefined;
                    'no-redeclare'?: undefined;
                    'no-throw-literal'?: undefined;
                    'no-unused-expressions'?: undefined;
                    'no-unused-vars'?: undefined;
                    'no-use-before-define'?: undefined;
                    'no-empty-function'?: undefined;
                    '@typescript-eslint/array-type'?: undefined;
                    '@typescript-eslint/member-delimiter-style'?: undefined;
                    '@typescript-eslint/member-ordering'?: undefined;
                    '@typescript-eslint/method-signature-style'?: undefined;
                    '@typescript-eslint/naming-convention'?: undefined;
                    '@typescript-eslint/no-confusing-non-null-assertion'?: undefined;
                    '@typescript-eslint/no-confusing-void-expression'?: undefined;
                    '@typescript-eslint/no-dynamic-delete'?: undefined;
                    '@typescript-eslint/no-empty-interface'?: undefined;
                    '@typescript-eslint/no-for-in-array'?: undefined;
                    '@typescript-eslint/no-implicit-any-catch'?: undefined;
                    '@typescript-eslint/no-require-imports'?: undefined;
                    '@typescript-eslint/no-unnecessary-boolean-literal-compare'?: undefined;
                    '@typescript-eslint/no-unnecessary-condition'?: undefined;
                    '@typescript-eslint/no-unnecessary-qualifier'?: undefined;
                    '@typescript-eslint/no-unnecessary-type-constraint'?: undefined;
                    '@typescript-eslint/non-nullable-type-assertion-style'?: undefined;
                    '@typescript-eslint/prefer-nullish-coalescing'?: undefined;
                    '@typescript-eslint/prefer-optional-chain'?: undefined;
                    '@typescript-eslint/prefer-reduce-type-parameter'?: undefined;
                    '@typescript-eslint/prefer-string-starts-ends-with'?: undefined;
                    '@typescript-eslint/prefer-ts-expect-error'?: undefined;
                    '@typescript-eslint/promise-function-async'?: undefined;
                    '@typescript-eslint/switch-exhaustiveness-check'?: undefined;
                    '@typescript-eslint/type-annotation-spacing'?: undefined;
                    '@typescript-eslint/unified-signatures'?: undefined;
                    '@typescript-eslint/brace-style'?: undefined;
                    '@typescript-eslint/comma-dangle'?: undefined;
                    '@typescript-eslint/comma-spacing'?: undefined;
                    '@typescript-eslint/default-param-last'?: undefined;
                    '@typescript-eslint/dot-notation'?: undefined;
                    '@typescript-eslint/func-call-spacing'?: undefined;
                    '@typescript-eslint/keyword-spacing'?: undefined;
                    '@typescript-eslint/lines-between-class-members'?: undefined;
                    '@typescript-eslint/no-dupe-class-members'?: undefined;
                    '@typescript-eslint/no-duplicate-imports'?: undefined;
                    '@typescript-eslint/no-redeclare'?: undefined;
                    '@typescript-eslint/no-throw-literal'?: undefined;
                    '@typescript-eslint/no-unused-expressions'?: undefined;
                    '@typescript-eslint/no-unused-vars'?: undefined;
                    '@typescript-eslint/no-use-before-define'?: undefined;
                };
                parser?: undefined;
                plugins?: undefined;
                extends?: undefined;
                parserOptions?: undefined;
                settings?: undefined;
            })[];
        };
        'eslint-recommended': {
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
                    'lines-between-class-members': string[];
                    'new-cap': string;
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
    };
};
export = _default;
