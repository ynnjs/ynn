/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/

import { VariadicClass } from '@ynn/utility-types';
import { createInterceptorParameter, getMetadataParameter, InterceptorAfter, InterceptorBefore, InterceptorException } from '@ynn/method-interceptor';
import { ACTION_METADATA_KEY } from '@ynn/common';
import { Ynn } from './ynn';
import { Context } from './context';
import { fillParams } from './util/fill-params';
import { createABEFInterceptors } from './util/create-abef-interceptors';

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

const hasOwnProperty = Object.prototype.hasOwnProperty;

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
    while( proto ) {

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
        } );
        proto = Reflect.getPrototypeOf( proto );
    }

    return actions;
}

export type Executor = ( context: Context ) => unknown;


/**
 * create action executor functions for every action function in specific controller.
 */
export function createExecutors( mountingPath: Ynn[], Controller: VariadicClass ): Record<string, Executor> {

    const executors: Record<string, Executor> = {};
    const actionInfos = scan( Controller.prototype );

    const afters: InterceptorAfter<[ Context ]>[] = [];
    const befores: InterceptorBefore<[ Context ]>[] = [];
    const exceptions: InterceptorException<[ Context ]>[] = [];

    for( const item of mountingPath ) {
        const Constructor = item.module ?? item.constructor;
        const [ after, before, exception ] = createABEFInterceptors( Constructor );
        afters.push( after );
        befores.push( before );
        exceptions.push( exception );
    }

    const [ controllerAfter, controllerBefore, controllerException ] = createABEFInterceptors( Controller );
    afters.push( controllerAfter );
    befores.push( controllerBefore );
    exceptions.push( controllerException );

    Object.keys( actionInfos ).forEach( ( actionName: string ) => {
        const info = actionInfos[ actionName ];
        const { descriptor, methodName, proto } = info;

        const [ after, before, exception ] = createABEFInterceptors( descriptor );

        const parameter = createInterceptorParameter<[ Context ]>( proto, methodName );
        const metadataParameter = getMetadataParameter( proto, methodName );
        const paramtypes = Reflect.getMetadata( 'design:paramtypes', proto, methodName );

        const controllerParameter = createInterceptorParameter<[ Context ]>( Controller );
        const controllerMetadataParameter = getMetadataParameter( Controller );
        const controllerParamtypes = Reflect.getMetadata( 'design:paramtypes', Controller );

        executors[ actionName ] = async ( context: Context ): Promise<unknown> => {

            return Promise.all( [ before( context ), ...befores.map( async item => item( context ) ) ] ).then( async () => {

                const controllerParams = await fillParams( await controllerParameter( context ), controllerMetadataParameter, controllerParamtypes, [ context ] );
                const params = await fillParams( await parameter( context ), metadataParameter, paramtypes, [ context ] );
                const response = new Controller( ...controllerParams )[ methodName ]( ...params );

                let res = after( response, context );
                for( let i = afters.length - 1; i > 0; i -= 1 ) {
                    res = res.then( async val => afters[ i ]( val, context ) );
                }
                return res;
            } ).catch( async ( e: unknown ) => {
                let promise = exception( e, context );
                for( let i = exceptions.length - 1; i > 0; i -= 1 ) {
                    promise = promise.catch( async ( e: unknown ) => exceptions[ i ]( e, context ) );
                }
                return promise;
            } );
        };
    } );
    return executors;
}
