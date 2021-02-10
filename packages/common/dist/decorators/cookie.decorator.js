"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/cookie.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = void 0;
function Cookie(propertyOrPipeOrCookies, pipeOrValue) {
    const t1 = typeof propertyOrPipeOrCookies;
    const t2 = typeof pipeOrValue;
    if ((t1 === 'string' && t2 === 'string') || (t2 === 'undefined' && t1 === 'object')) {
        return (target, key, parameterIndexOrDescriptor) => {
        };
    }
    return (target, key, parameterIndexOrDescriptor) => {
    };
}
exports.Cookie = Cookie;
