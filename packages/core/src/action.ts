/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description: 
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import { ACTIONS_METADATA_KEY, ACTION_METHOD_SUFFIX } from './constants';

export type ActionInfo = {
    methodName: string | symbol | number;
    descriptor: TypedPropertyDescriptor<any>;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const ACTION_METHOD_SUFFIX_LENGTH = ACTION_METHOD_SUFFIX.length;

export function scanner( obj: any ) {
    const actions: Record<string, ActionInfo> = {};
    const hasOwn = hasOwnProperty.bind( actions );
    const overwritten: Set<string | symbol> = new Set();

    let proto: any = obj;

    /**
     * to scan action methods from current object hierarchically.
     */
    while( proto ) {

        Reflect.ownKeys( proto ).forEach( ( key: string | symbol | number ) => {
            if( hasOwn( key ) || overwritten.has( key ) ) return;

            /**
             * An action must be a function
             * the property will overwrite the one has same name in prorotype chain.
             */
            if( typeof proto[ key ] !== 'function' ) {
                overwritten.add( key );
                return;
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( proto, key );

            if( !descriptor ) return;

            /**
             * scan all actions are exposed by @Action() decorator
             */
            Reflect.getMetadata( ACTIONS_METADATA_KEY, descriptor.value )?.forEach( ( name: string ) => {
                actions[ name ] = { methodName : key, descriptor }
            } );

            /**
             * scan all methods whose name end withs 'Action'
             */
            if( typeof key === 'string' && key.endsWith( ACTION_METHOD_SUFFIX ) ) {
                const name = key.substr( 0, key.length - ACTION_METHOD_SUFFIX_LENGTH );
                /**
                 * the action method that exposed with @Action() decorator has high precedence.
                 * indexAction should not override @Action( 'index' )
                 */
                if( hasOwn( name ) ) return;

                actions[ name ] = { methodName : key, descriptor };
            }
        } );
        proto = Reflect.getPrototypeOf( proto );
    }

    return actions;
}

export function register( Controller, actionInfo: ActionInfo ) {
    return ( ctx: KoaContext ) => {
        const { methodName, descriptor } = actionInfo;
        const controller = new Controller( ctx );
        const args = [];

        /**
         * execute all steps specified with action method decorator
         */
        Reflect.getMetadata( ACTION_METHOD_METADATA_KEY, descriptor.value ).forEach();


        const response = controller[ methodName ]( ...args );
    };
}
