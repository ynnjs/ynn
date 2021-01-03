/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description: 
 ******************************************************************/

import recommended from './configs/recommended';
import eslintRecommended from './configs/eslint-recommended';
import rules from './rules';

export = {
    rules,
    configs : {
        recommended,
        'eslint-recommended' : eslintRecommended
    }
}
