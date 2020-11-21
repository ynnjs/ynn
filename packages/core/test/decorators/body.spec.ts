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

describe( 'Ynn Decorator: Body', () => {

    describe( 'Method Decorator', () => {

        it( '', () => {
            
            class C extends Controller {

                @Body()
                indexAction() {
                }
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( C.prototype, 'indexAction' );
            const metadata = Reflect.getMetadata( '__ACTION_BODY__', descriptor!.value );

            console.log( '<<<<<<<<<<<<', ( global as any ).abcdefg === descriptor );

            console.log( metadata );
        } );
    } );

    xdescribe( 'Parameter Decorator', () => {

        it( '', () => {
            
            class C extends Controller {
                indexAction( @Body() data: any ) {
                    return data;
                }
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( C.prototype, 'indexAction' );

            const metadata = Reflect.getMetadata( '__PARAM_BODY__', descriptor as any );
            console.log( metadata );
        } );
        
    } );
    
} );
