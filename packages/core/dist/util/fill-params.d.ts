/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/fill-params.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/17/2021
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
import { MetadataParameter } from '@ynn/method-interceptor';
export declare function fillParams<T extends unknown[]>( params: unknown[], metadatas: ( MetadataParameter | undefined )[], paramtypes: VariadicClass[], ...args: T ): Promise<unknown[]>;
