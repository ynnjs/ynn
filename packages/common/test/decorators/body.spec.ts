/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/body.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/21/2020
 * Description: 
 ******************************************************************/

import 'reflect-metadata';
import { Body } from '../../src/decorators/body.decorator';
import Controller from '../../src/controller';
import {
    PARAM_BODY_METADATA,
    ACTION_BODY_METADATA,
    PARAM_QUERY_METADATA,
    ACTION_QUERY_METADATA
} from '../../src/constants';

describe( 'Ynn Decorator: Body', () => {

    describe( 'Method Decorator', () => {

        it( '', () => {
            
            class C extends Controller {

                @Body()
                indexAction() {
                }
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( C.prototype, 'indexAction' );
            const metadata = Reflect.getMetadata( ACTION_BODY_METADATA, descriptor!.value );

            console.log( 'Method Decorator: ', metadata );

            Reflect.deleteMetadata( ACTION_BODY_METADATA, descriptor!.value );
        } );
    } );

    describe( 'Parameter Decorator', () => {

        it( '', () => {
            
            class C extends Controller {
                indexAction( @Body() data: any ) {
                    return data;
                }
            }

            const metadata = Reflect.getMetadata( PARAM_BODY_METADATA, C, 'indexAction' );
            console.log( 'Parameter Decorator: ', metadata );
            Reflect.deleteMetadata( PARAM_BODY_METADATA, C, 'indexAction' );
        } );
        
    } );
    
} );
