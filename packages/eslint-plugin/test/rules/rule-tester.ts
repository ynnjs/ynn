/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: rules/rule-tester.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/04/2021
 * Description:
 ******************************************************************/

import { RuleTester } from 'eslint';

export default new RuleTester( {
    parserOptions : {
        ecmaVersion : 2020
    },
    env : {
        es6 : true
    }
} );
