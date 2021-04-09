/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/storage.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/30/2021
 * Description:
 ******************************************************************/
import { VariadicFunction } from '@ynn/utility-types';
declare type Key = string | number | symbol;
export declare class Storage {
    private static map;
    private static n;
    static set( key: Key, method: VariadicFunction ): void;
    static get( key: Key ): VariadicFunction | undefined;
    static key( prefix?: string ): symbol;
}
export {};
