/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/response.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/17/2020
 * Description:
 ******************************************************************/

import { Context } from '@ynn/waka';
import { Pipe, ResponseMetadata } from '../interfaces';
import { createDecorator, executePipes } from './util';

interface ResponseParameters {
    data: unknown;
    pipes: Pipe[];
};

export function Response( data: unknown, ...pipes: Pipe[] ): MethodDecorator & ClassDecorator {

    if( typeof data === 'function' ) {
        pipes.unshift( data as Pipe );
        data = undefined;
    }

    const parameters: ResponseParameters = { data, pipes };

    return createDecorator( {
        responseInterceptor : async ( metadata: ResponseMetadata, value: unknown, ctx: Context ) => {
            const parameters = metadata.parameters as ResponseParameters;
            return executePipes( parameters.pipes, parameters.data === undefined ? value : parameters.data, ctx );
        },
        parameters
    } );
}
