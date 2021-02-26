"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/match.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/26/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const common_1 = require("@ynn/common");
function Match(pattern) {
    const t = typeof pattern;
    const isRegexp = pattern instanceof RegExp;
    return (value, ctx, metadata) => {
        const property = metadata.parameters?.property; // eslint-disable-line @typescript-eslint/no-explicit-any
        const str = typeof value === 'string' ? value : String(value);
        let message = '';
        if (t === 'string') {
            if (pattern === str)
                return value;
            message = property ? `${property} should equal to ${pattern}` : `paramater does't match ${pattern}`;
        }
        else if (isRegexp) {
            if (pattern.test(str))
                return value;
            message = property ? `${property} should match ${pattern.toString()}` : `paramater does't match ${pattern.toString()}`;
        }
        else {
            for (const item of pattern) {
                if (typeof item === 'string' && item === str)
                    return value;
                if (item instanceof RegExp && item.test(str))
                    return value;
                message = property ? `${property} should match patterns` : 'paramater does\'t match patterns';
            }
        }
        throw new common_1.HttpException({
            status: 400,
            message: [message]
        });
    };
}
exports.Match = Match;
