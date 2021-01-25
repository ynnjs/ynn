/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: decorator/create-decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/24/2021
 * Description:
 ******************************************************************/

import { MetadataBefore, MetadataAfter, MetadataParameter, MetadataException } from '../metadata.interface';

export interface CreateDecoratorOptions {
}

export default function createDecorator(
    metadata: MetadataBefore | MetadataAfter | MetadataParameter | MetadataException,
    callback
): MethodDecorator {
}

const Body = function( ) {
    return createDecorator( 'body', B() );
}

class Controller {
    @Body
    action() {

    }
}

