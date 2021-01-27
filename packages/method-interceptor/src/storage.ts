/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/storage.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/25/2021
 * Description:
 ******************************************************************/

import { VariadicFunction } from '@ynn/utility-types';

type Key = string | number | symbol;

export default class Storage {

    private static map: Map<Key, VariadicFunction> = new Map();

    private static n = 0;

    static set( key: Key, method: VariadicFunction ): void {
        Storage.map.set( key, method );
    }

    static get( key: Key ): VariadicFunction | undefined {
        return Storage.map.get( key );
    }

    static key( prefix = '' ): symbol {
        return Symbol( `${prefix}${Storage.n++}` );
    }
}
