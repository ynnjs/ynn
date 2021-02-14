/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/14/2021
 * Description:
 ******************************************************************/

import { RequiredKeys } from '@ynn/utility-types';
import { MetadataBefore, MetadataParameter, MetadataAfter, MetadataException } from '@ynn/method-interceptor';
import { Pipe } from './pipe.interface';

export interface CommonMetadateParameters {
    property?: string;
    pipes: Pipe[];
}

export type RequestMetadata<T = unknown> = MetadataBefore<T>;

export type ParameterMetadata<T = unknown> = MetadataParameter<T>;

export type ResponseMetadata<T = unknown> = MetadataAfter<T>;

export type ExceptionMetadata<T = unknown> = MetadataException<T>;

export type CommonRequestMetadata = RequiredKeys<RequestMetadata<CommonMetadateParameters>, 'parameters'>;

export type CommonParameterMetadata = RequiredKeys<ParameterMetadata<CommonMetadateParameters>, 'parameters'>;

export type CommonExceptionMetadata = RequiredKeys<ExceptionMetadata<CommonMetadateParameters>, 'parameters'>;
