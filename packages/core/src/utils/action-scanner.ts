/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: utils/action-scanner.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/30/2020
 * Description: 
 ******************************************************************/

import { ACTIONS_METADATA_KEY, ACTION_METHOD_SUFFIX } from '../constants';

export type ActionInfo = {
    methodName: string | symbol;
    descriptor: TypedPropertyDescriptor<any>;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const ACTION_METHOD_SUFFIX_LENGTH = ACTION_METHOD_SUFFIX.length;

export default function scanner( obj: any ) {
    const actions: Record<string, ActionInfo> = {};
    const hasOwn = hasOwnProperty.bind( actions );
    const overwritten : Record<string | symbol, true> = {};
    const hasOverwritten = hasOwnProperty.bind( overwritten );

    let proto: any = obj;

    /**
     * to scan action method from current object hierarchically.
     */
    while( proto ) {

        Reflect.ownKeys( proto ).forEach( ( key: string | symbol | number ) => {
            if( hasOwn( key ) || hasOverwritten( key ) || typeof key === 'number' ) return;

            /**
             * An action must be a function
             * the property will overwrite the one has same name in prorotype chain.
             */
            if( typeof proto[ key ] !== 'function' ) {
                overwritten[ key ] = true;
                return;
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( proto, key );

            /**
             * scan all actions are exposed by @Action() decorator
             */
            Reflect.getMetadata( ACTIONS_METADATA_KEY, descriptor.value )?.forEach( ( name: string ) => {
                actions[ name ] = {
                    methodName : key,
                    descriptor
                }
            } );

            /**
             * scan all methods whose name end withs 'Action'
             */
            if( typeof key === 'string' && key.endsWith( ACTION_METHOD_SUFFIX ) ) {
                /**
                 * the action method that exposed with @Action() decorator has high precedence.
                 * indexAction should not override @Action( 'index' )
                 */
                if( hasOwn( key ) ) return;
                
                actions[ key.substr( 0, key.length - ACTION_METHOD_SUFFIX_LENGTH ) ] = {
                    methodName : key,
                    descriptor
                };
            }
        } );
        proto = Reflect.getPrototypeOf( proto );
    }

    return actions;
}
