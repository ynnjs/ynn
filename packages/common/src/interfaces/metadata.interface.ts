/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

import { RequiredKeys } from '@ynn/utility-types';
import { MetadataBefore, MixedMetadataParameter, MetadataAfter, MetadataException } from '@ynn/method-interceptor';
import { Pipe } from './pipe.interface';

export interface CommonMetadataParameters {
    property?: string;
    pipes: Pipe[];
}

export type RequestMetadata<T = unknown> = MetadataBefore<T>;
export type ParameterMetadata<T = unknown> = MixedMetadataParameter<T>;
export type ResponseMetadata<T = unknown> = MetadataAfter<T>;
export type ExceptionMetadata<T = unknown> = MetadataException<T>;
export type CommonRequestMetadata = RequiredKeys<RequestMetadata<CommonMetadataParameters>, 'parameters'>;
export type CommonParameterMetadata = RequiredKeys<ParameterMetadata<CommonMetadataParameters>, 'parameters'>;
export type CommonExceptionMetadata = RequiredKeys<ExceptionMetadata<CommonMetadataParameters>, 'parameters'>;
export type Metadata = RequestMetadata | ParameterMetadata | ResponseMetadata | ExceptionMetadata;
