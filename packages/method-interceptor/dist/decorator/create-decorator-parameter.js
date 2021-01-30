"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-parameter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorParameter = void 0;
const metadata_1 = require("../metadata");
function createDecoratorParameter(method, options = {}) {
    return (target, key, i) => {
        metadata_1.saveMetadataParameter(target, key, i, method, options);
    };
}
exports.createDecoratorParameter = createDecoratorParameter;
