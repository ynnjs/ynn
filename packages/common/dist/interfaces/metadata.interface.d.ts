/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/14/2021
 * Description:
 ******************************************************************/
import { RequiredKeys } from '@ynn/utility-types';
import { MetadataBefore, MixedMetadataParameter, MetadataAfter, MetadataException } from '@ynn/method-interceptor';
import { Pipe } from './pipe.interface';
export interface CommonMetadateParameters {
    property?: string;
    pipes: Pipe[];
}
export declare type RequestMetadata<T = unknown> = MetadataBefore<T>;
export declare type ParameterMetadata<T = unknown> = MixedMetadataParameter<T>;
export declare type ResponseMetadata<T = unknown> = MetadataAfter<T>;
export declare type ExceptionMetadata<T = unknown> = MetadataException<T>;
export declare type CommonRequestMetadata = RequiredKeys<RequestMetadata<CommonMetadateParameters>, 'parameters'>;
export declare type CommonParameterMetadata = RequiredKeys<ParameterMetadata<CommonMetadateParameters>, 'parameters'>;
export declare type CommonExceptionMetadata = RequiredKeys<ExceptionMetadata<CommonMetadateParameters>, 'parameters'>;
export declare type Metadata = RequestMetadata | ParameterMetadata | ResponseMetadata | ExceptionMetadata;
