"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/storage.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    static set(key, method) {
        Storage.map.set(key, method);
    }
    static get(key) {
        return Storage.map.get(key);
    }
    static key(prefix = '', type = 'symbol') {
        const k = `${prefix}${Storage.n++}`;
        if (type === 'string')
            return k;
        return Symbol(k);
    }
}
exports.default = Storage;
Storage.map = new Map();
Storage.n = 0;
