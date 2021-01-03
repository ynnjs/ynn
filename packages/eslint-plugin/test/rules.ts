/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: rules/no-literal-url.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/

import rules from '../src/rules';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester( {
    parserOptions : {
        ecmaVersion : 2020
    },
    env : {
        es6 : true
    }
} );

console.log( 'test completed successfully' );
