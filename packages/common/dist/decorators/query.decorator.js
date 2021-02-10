"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/query.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const method_interceptor_1 = require("@ynn/method-interceptor");
const interceptors_1 = require("../interceptors");
const util_1 = require("./util");
function Query(...args) {
    const parameters = util_1.createGeneralMetadataParameters(...args);
    return (target, key, indexOrDescriptor) => {
        if (typeof indexOrDescriptor === 'number') {
            method_interceptor_1.saveMetadataParameter(target, key, indexOrDescriptor, interceptors_1.interceptorParameterQuery, { parameters });
        }
        else {
            method_interceptor_1.saveMetadataBefore(indexOrDescriptor, interceptors_1.interceptorBeforeQuery, { parameters });
        }
    };
}
exports.Query = Query;
