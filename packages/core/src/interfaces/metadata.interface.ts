/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: interfaces/metadata.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description: 
 ******************************************************************/

import Pipe from './pipe.interface';

export interface ActionMethodMetadata {
    type: string;
    property?: string | symbol | number | undefined;
    pipe?: Pipe | undefined;
}

export interface ActionParameterMetadata {
    type: string;
    property?: string | symbol | number | undefined;
    pipe?: Pipe | undefined;
}

export type ActionParameterMetadataList = (ActionParameterMetadata | undefined)[];
