"use strict";
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: middlewares/compose.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 09/30/2020
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
function compose(middleware) {
    return (ctx, next, ...args) => {
        // last called middleware
        let index = -1;
        function dispatch(i) {
            if (i <= index)
                return Promise.reject(new Error('next() called multiple times'));
            index = i;
            const fn = i === middleware.length ? next : middleware[i];
            if (!fn)
                return Promise.resolve();
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1), ...args));
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        return dispatch(0);
    };
}
exports.default = compose;
