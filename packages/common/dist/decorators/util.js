"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/util.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/26/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeneralBeforeAndParameterActionDecorator = exports.createGeneralBeforeAndParameterMetadataParameters = void 0;
const method_interceptor_1 = require("@ynn/method-interceptor");
function createGeneralBeforeAndParameterMetadataParameters(propertyOrPipe, pipeFunction) {
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
    return parameters;
}
exports.createGeneralBeforeAndParameterMetadataParameters = createGeneralBeforeAndParameterMetadataParameters;
function createGeneralBeforeAndParameterActionDecorator(options, propertyOrPipe, pipeFunction) {
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
    return (target, key, indexOrDescriptor) => {
        if (typeof indexOrDescriptor === 'number') {
            method_interceptor_1.saveMetadataParameter(target, key, indexOrDescriptor, options.interceptorParameter, { parameters });
            return;
        }
        method_interceptor_1.saveMetadataBefore(indexOrDescriptor, options.interceptorBefore, { parameters });
    };
}
exports.createGeneralBeforeAndParameterActionDecorator = createGeneralBeforeAndParameterActionDecorator;
