/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/

import { ACTION_METADATA_KEY, ACTION_METHOD_SUFFIX } from './constants';

export interface ActionInfo {
    /**
     * the method name, parameter decorators save metadata based on method name and prototype
     */
    methodName: string | symbol;

    /**
     * the descriptor of the property, method decorators save metadata based on descriptor.value
     */
    descriptor: PropertyDescriptor;

    /**
     * the prototype which has the action
     */
    proto: object; // eslint-disable-line
}

/**
 * generate the `@Action` decorator which is used to mark a instance method to be an `Action`.
 *
 * @param name - the `Action`'s name, using the method name by default.
 *
 * @return a method decorator
 */
export function Action( name?: string ): MethodDecorator {
    return ( target, key: string | symbol, descriptor: PropertyDescriptor ): void => {
        const metadata = Reflect.getMetadata( ACTION_METADATA_KEY, descriptor.value ) || [];
        metadata.push( name ?? key );
        Reflect.defineMetadata( ACTION_METADATA_KEY, metadata, descriptor.value );
    };
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
const ACTION_METHOD_SUFFIX_LENGTH = ACTION_METHOD_SUFFIX.length;

export function scan(
    obj: object // eslint-disable-line
): Record<string, ActionInfo> {

    const actions: Record<string, ActionInfo> = {};
    const hasOwn = hasOwnProperty.bind( actions );
    const overwritten: Set<string | symbol> = new Set();

    let proto: object | null = obj; // eslint-disable-line

    /**
     * to scan action methods from current object hierarchically.
     */
    while( proto ) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition

        ( Reflect.ownKeys( proto ) as ( string | symbol )[] ).forEach( ( key: string | symbol ) => {
            if( hasOwn( key ) || overwritten.has( key ) ) return;

            /**
             * An action must be a function
             * the property will overwrite the one has same name in prorotype chain.
             */
            if( typeof proto?.[ key ] !== 'function' ) {
                overwritten.add( key );
                return;
            }

            const descriptor = Reflect.getOwnPropertyDescriptor( proto, key );

            if( !descriptor ) return;

            /**
             * scan all actions are exposed by @Action() decorator
             */
            Reflect.getMetadata( ACTION_METADATA_KEY, descriptor.value )?.forEach( ( name: string ) => {
                actions[ name ] = {
                    proto : proto!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
                    methodName : key,
                    descriptor
                };
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

                actions[ name ] = { methodName : key, descriptor, proto };
            }
        } );
        proto = Reflect.getPrototypeOf( proto );
    }

    return actions;
}
