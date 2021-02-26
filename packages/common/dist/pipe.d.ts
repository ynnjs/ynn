/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/pipe.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/
import { Context } from '@ynn/core';
import { Pipe, Metadata } from './interfaces';
export declare function runPipe(pipe: Pipe, value: unknown, ctx: Context, metadata: Metadata): Promise<unknown>;
export declare function runPipesInSequence(pipes: Pipe[], value: unknown, ctx: Context, metadata: Metadata): Promise<unknown>;
