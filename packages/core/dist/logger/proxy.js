"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (options) => {
    const { debugging = true, logging = false, logger, debug } = options;
    const blank = () => { };
    return new Proxy(logger || {}, {
        get(logger, method) {
            if (!debugging && (!logging || (logging && !logger)))
                return blank;
            let fn;
            if (logging) {
                if (typeof logger?.[method] === 'function') {
                    fn = logger[method].bind(logger);
                }
                else {
                    debugging && debug.error(`Function "${method}" not exists in logger.`);
                    fn = blank;
                }
            }
            else
                fn = blank;
            if (!debugging)
                return fn;
            return (...args) => {
                fn(...args);
                debug[typeof debug[method] === 'function' ? method : 'log'](...args);
            };
        }
    });
};
