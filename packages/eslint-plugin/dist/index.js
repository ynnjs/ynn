"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/23/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const recommended_1 = __importDefault(require("./configs/recommended"));
const eslint_recommended_1 = __importDefault(require("./configs/eslint-recommended"));
const rules_1 = __importDefault(require("./rules"));
module.exports = {
    rules: rules_1.default,
    configs: {
        recommended: recommended_1.default,
        'eslint-recommended': eslint_recommended_1.default
    }
};
