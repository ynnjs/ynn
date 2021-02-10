"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/create-action-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/29/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const method_interceptor_1 = require("@ynn/method-interceptor");
function default_1(method, propertyOrPipe, pipeFunction) {
    const t1 = typeof propertyOrPipe;
    const t2 = typeof pipeFunction;
    let property;
    let pipe;
    /**
     * both property and pipe can be empty
     */
    if (t1 === 'string')
        property = propertyOrPipe;
    else if (t1 === 'function')
        pipe = propertyOrPipe;
    if (!pipe && t2 === 'function')
        pipe = pipeFunction;
    const parameters = {};
    property && (parameters.property = property);
    pipe && (parameters.pipe = pipe);
    if (typeof indexOrDescriptor === 'number') {
        return method_interceptor_1.createDecoratorParameter(method, { parameters });
    }
    return method_interceptor_1.createDecoratorBefore(method, { parameters });
}
exports.default = default_1;
