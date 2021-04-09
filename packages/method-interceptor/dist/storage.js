'use strict';
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/storage.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.Storage = void 0;
class Storage {
    static set( key, method ) {
        Storage.map.set( key, method );
    }

    static get( key ) {
        return Storage.map.get( key );
    }

    static key( prefix = '' ) {
        return Symbol( `${prefix}${Storage.n++}` );
    }
}
exports.Storage = Storage;
Storage.map = new Map();
Storage.n = 0;
