/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description: 
 ******************************************************************/

import Pipe from './pipe.interface';

type Property = string | symbol | number | undefined;

export interface ActionMethodMetadata {
    type: string;
    property?: string | symbol | number | undefined;
    pipe?: Pipe | undefined;
}

export interface ActionParameterMetadata {
    type: string;
    property?: Property;
    pipe?: Pipe | undefined;
}

/**
 * the interface of metadata for `action`s.
 */
export interface ActionMetadata {
    type: string;
    decotype: 'method' | 'parameter';
    property?: Property;
    metatype?: unknown;
}

export type ActionParameterMetadataList = (ActionParameterMetadata | undefined)[];
