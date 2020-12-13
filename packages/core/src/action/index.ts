/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description: 
 ******************************************************************/

import { KoaContext } from '@ynn/koa';
import {
    ActionMethodMetadata,
    ActionParameterMetadata
} from './interfaces/metadata.interface';
import {
    ACTIONS_METADATA_KEY,
    ACTION_METHOD_SUFFIX,
    ACTION_METHOD_METADATA_KEY,
    ACTION_PARAMETER_METADATA_KEY
} from './constants';
import requestInterceptor from './request-interceptor';

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
        Reflect.getMetadata( ACTION_METHOD_METADATA_KEY, descriptor.value ).forEach( ( metadata: ActionMethodMetadata ) => {
            const { type, property, pipe } = metadata;

            switch( type ) {
                case 'body' : {
                    break;
                }
                case 'query' : {
                    break;
                }
                case 'param' : {
                    break;
                }
                case 'request' : {
                    break;
                }
                case 'req' : {
                    break;
                }
                case 'cookie' : {
                    break;
                }
                case 'header' : {
                    break;
                }
                case 'status' : {
                    break;
                }
                case 'exception' : {
                    break;
                }
                case 'file' : {
                    break;
                }
                case 'default' : {
                    break;
                }
            }
        } );

        {
            /**
             * to fill all arguments specified with parameter decorators.
             */

            const metadata: (ActionParameterMetadata | undefined)[] = Reflect.getMetadata( ACTION_PARAMETER_METADATA_KEY, Controller, methodName ) as (ActionParameterMetadata | undefined )[];

            const promises = [];

            metadata?.forEach( ( item: ActionParameterMetadata | undefined ) => {
                if( item === undefined ) {
                    args.push( undefined );
                    return;
                }

                switch( item.type ) {
                    case 'body' :
                    case 'query' : 
                    case 'param' : {
                        const promise = requestInterceptor[ item.type ]( ctx, metadata );
                        promises.push( promise );
                        break;
                    }
                }
            } );

            await Promise.all( promises );

        }

        const response = controller[ methodName ]( ...args );
    };
}
