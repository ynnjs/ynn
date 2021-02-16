"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const util_1 = require("./util");
function Status(codeOrHandler, message) {
    const parameters = {};
    if (typeof codeOrHandler === 'function') {
        parameters.handler = codeOrHandler;
    }
    else {
        parameters.code = codeOrHandler;
        typeof message === 'string' && (parameters.message = message);
    }
    return util_1.createDecorator({
        responseInterceptor: async (metadata, value, ctx) => {
            const parameters = metadata.parameters;
            if ('handler' in parameters && parameters.handler) {
                const res = await parameters.handler(ctx);
                if (res) {
                    if (typeof res === 'number') {
                        ctx.status = res;
                    }
                    else {
                        res.code && (ctx.status = res.code);
                        typeof res.message === 'string' && (ctx.message = res.message);
                    }
                }
            }
            else {
                const { code, message } = parameters;
                code && (ctx.status = code);
                typeof message === 'string' && (ctx.message = message);
            }
            return value;
        },
        parameters
    });
}
exports.Status = Status;
