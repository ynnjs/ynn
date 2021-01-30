"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-after.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/26/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorAfter = void 0;
const metadata_1 = require("../metadata");
function createDecoratorAfter(method, options = {}) {
    return (targt, key, descriptor) => {
        metadata_1.saveMetadataAfter(descriptor, method, options);
    };
}
exports.createDecoratorAfter = createDecoratorAfter;
