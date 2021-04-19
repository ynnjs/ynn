/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: interfaces/pipe.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { Context } from '../context';
import { Metadata } from './metadata.interface';

export interface PipeFunction<T = any, R = any, M extends Metadata = Metadata> { // eslint-disable-line @typescript-eslint/no-explicit-any
    ( value: T, ctx: Context, metadata: M ): R;
}

export interface PipeTransform<T = any, R = any, M extends Metadata = Metadata> { // eslint-disable-line @typescript-eslint/no-explicit-any
    transform: ( value: T, ctx: Context, metadata: M ) => R;
}

export type PipeConstructor = VariadicClass<any[], PipeTransform>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Pipe = PipeFunction | PipeTransform | PipeConstructor;
