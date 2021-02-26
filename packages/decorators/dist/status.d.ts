/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/status.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/16/2020
 * Description:
 ******************************************************************/
import { Context } from '@ynn/core';
declare type Result = {
    code: number;
    message?: string;
} | number | undefined;
declare type Handler = (ctx: Context) => Result | Promise<Result> | void;
export declare function Status(handler: Handler): MethodDecorator;
export declare function Status(code: number, message?: string): MethodDecorator;
export {};