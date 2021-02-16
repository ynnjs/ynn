"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/body.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const body_1 = __importDefault(require("@ynn/body"));
const util_1 = require("./util");
/**
 * function for interceptor before and interceptor parameter
 *
 * @example
 *
 * @param metadata
 * @param ctx
 */
async function requestAndParameterInterceptor(metadata, ctx) {
    /**
     * don't parse the body multiple times if it has already been parsed
     */
    if (ctx.request.body === undefined)
        ctx.request.body = await body_1.default(ctx);
    const body = ctx.request.body;
    const { property } = metadata.parameters;
    let value;
    if (property) {
        try {
            value = body[property]; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            value = undefined;
        }
    }
    else
        value = body;
    return util_1.executePipes(metadata.parameters.pipes, value, ctx);
}
function Body(...args) {
    return util_1.createGeneralDecorator({
        parameterInterceptor: requestAndParameterInterceptor,
        requestInterceptor: requestAndParameterInterceptor
    }, ...args);
}
exports.Body = Body;
