/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: request/body.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description:
 ******************************************************************/
import { MetadataBefore, MetadataParameter } from '@ynn/method-interceptor';
import { Context } from '../../interfaces';
/**
 * function for interceptor before and interceptor parameter
 *
 * @example
 *
 * @param metadata
 * @param ctx
 */
export declare function interceptorBeforeBody(metadata: Readonly<MetadataBefore> | Readonly<MetadataParameter>, context: Context): Promise<unknown>;
