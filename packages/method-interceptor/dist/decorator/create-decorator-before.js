"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator-before.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDecoratorBefore = void 0;
const metadata_1 = require("../metadata");
function createDecoratorBefore(method, options = {}) {
    return (target, key, descriptor) => {
        metadata_1.saveMetadataBefore(descriptor, method, options);
    };
}
exports.createDecoratorBefore = createDecoratorBefore;
