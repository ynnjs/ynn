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
const constants_1 = require("../constants");
function createBeforeDecorator(options) {
    const metadata = {
        type: options.type || ,
        interceptorType: 'before'
    };
    if ('parameters' in options) {
        metadata.parameters = options.parameters;
    }
    return (target, key, descriptor) => {
        const metadatas = Reflect.getMetadata(constants_1.KEY_BEFORE, descriptor.value) || [];
        metadatas.push(metadata);
        Reflect.defineMetadata(constants_1.KEY_BEFORE, metadatas, descriptor.value);
    };
}
exports.default = createBeforeDecorator;
