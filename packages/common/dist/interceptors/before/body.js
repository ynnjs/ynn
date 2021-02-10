"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptorBeforeBody = void 0;
const body_1 = __importDefault(require("@ynn/body"));
/**
 * function for interceptor before and interceptor parameter
 *
 * @example
 *
 * @param metadata
 * @param ctx
 */
async function interceptorBeforeBody(metadata, context) {
    /**
     * don't parse the body multiple times if it has already been parsed
     */
    if (!('body' in context))
        context.body = body_1.default(context);
    const body = await context.body;
    const parameters = metadata.parameters;
    const value = parameters.property ? body[parameters.property] : body;
    return parameters.pipe ? parameters.pipe(value, context, parameters) : value;
}
exports.interceptorBeforeBody = interceptorBeforeBody;
