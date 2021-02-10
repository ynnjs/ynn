"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/parseurl.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/09/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseurl = void 0;
const url_1 = require("url");
const lru_cache_1 = __importDefault(require("lru-cache"));
const cache = new lru_cache_1.default(10000);
/**
 * fastparse function being used in Koa
 * https://github.com/pillarjs/parseurl/blob/master/index.js
 */
function fastparse(str) {
    /**
     * if url starts with '/'
     */
    if (str.charCodeAt(0) !== 0x2f)
        return url_1.parse(str);
    let pathname = str;
    let query = null;
    let search = null;
    // This takes the regexp from https://github.com/joyent/node/pull/7878
    // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
    // And unrolls it into a for loop
    for (let i = 1; i < str.length; i++) {
        switch (str.charCodeAt(i)) {
            case 0x3f: /* ?  */
                if (search === null) {
                    pathname = str.substring(0, i);
                    query = str.substring(i + 1);
                    search = str.substring(i);
                }
                break;
            case 0x09: /* \t */
            case 0x0a: /* \n */
            case 0x0c: /* \f */
            case 0x0d: /* \r */
            case 0x20: /*    */
            case 0x23: /* #  */
            case 0xa0:
            case 0xfeff:
                return url_1.parse(str);
        }
    }
    const url = Url !== undefined ? new Url() : {};
    url.path = str;
    url.href = str;
    url.pathname = pathname;
    if (search !== null) {
        url.query = query;
        url.search = search;
    }
    return url;
}
function parseurl(url) {
    const parsed = cache.get(url);
    if (!parsed) {
        parsed = fastparse();
        cache.set(url, parsed);
    }
    return { ...parsed };
}
exports.parseurl = parseurl;
