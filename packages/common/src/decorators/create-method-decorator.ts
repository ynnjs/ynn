/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorators/create-action-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/29/2021
 * Description:
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import { createDecoratorParameter, createDecoratorBefore, MethodBefore } from '@ynn/method-interceptor';
import Pipe from '../interfaces/pipe.interface';


export default function(
    method: MethodBefore<[KoaContext]>,
    propertyOrPipe?: string | Pipe,
    pipeFunction?: Pipe
): MethodDecorator {

    const t1 = typeof propertyOrPipe;
    const t2 = typeof pipeFunction;

    let property: string | undefined;
    let pipe: Pipe | undefined;

    /**
     * both property and pipe can be empty
     */
    if( t1 === 'string' ) property = propertyOrPipe as string;
    else if( t1 === 'function' ) pipe = propertyOrPipe as Pipe;

    if( !pipe && t2 === 'function' ) pipe = pipeFunction as Pipe;

    const parameters = {};

    property && ( parameters.property = property );
    pipe && ( parameters.pipe = pipe );

    if( typeof indexOrDescriptor === 'number' ) {
        return createDecoratorParameter( method, { parameters } );
    }
    return createDecoratorBefore( method, { parameters } );
}
