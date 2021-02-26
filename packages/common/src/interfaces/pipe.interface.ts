/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/pipe.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { Context } from '@ynn/core';
import { Metadata } from './metadata.interface';

export interface PipeFunction<T = any, R = any, M extends Metadata = Metadata> { // eslint-disable-line @typescript-eslint/no-explicit-any
    // ( value: unknown, ctx: Context, metadata: ActionMetadata ): unknown;
    ( value: T, ctx: Context, metadata: M ): R;
}

export interface PipeInterface<T = any, R = any, M extends Metadata = Metadata> { // eslint-disable-line @typescript-eslint/no-explicit-any
    transform: ( value: T, ctx: Context, metadata: M ) => R;
}

export type PipeConstructor = VariadicClass<any[], PipeInterface>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Pipe = PipeFunction | PipeInterface | PipeConstructor;
