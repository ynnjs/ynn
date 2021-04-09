'use strict';
/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/
Object.defineProperty( exports, '__esModule', { value : true } );
exports.createExecutors = exports.scan = exports.Action = void 0;
const method_interceptor_1 = require( '@ynn/method-interceptor' );
const constants_1 = require( './constants' );
const fill_params_1 = require( './util/fill-params' );
const create_abe_interceptors_1 = require( './util/create-abe-interceptors' );
/**
 * generate the `@Action` decorator which is used to mark a instance method to be an `Action`.
 *
 * @param name - the `Action`'s name, using the method name by default.
 *
 * @return a method decorator
 */
function Action( name ) {
    return ( target, key, descriptor ) => {
        const metadata = Reflect.getMetadata( constants_1.ACTION_METADATA_KEY, descriptor.value ) || [];
        metadata.push( name ?? key );
        Reflect.defineMetadata( constants_1.ACTION_METADATA_KEY, metadata, descriptor.value );
    };
}
exports.Action = Action;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const ACTION_METHOD_SUFFIX_LENGTH = constants_1.ACTION_METHOD_SUFFIX.length;
function scan(obj // eslint-disable-line
) {
    const actions = {};
    const hasOwn = hasOwnProperty.bind( actions );
    const overwritten = new Set();
    let proto = obj; // eslint-disable-line
    /**
     * to scan action methods from current object hierarchically.
     */
    while( proto ) {
        Reflect.ownKeys( proto ).forEach( ( key ) => {
            if( hasOwn( key ) || overwritten.has( key ) )
                return;
            /**
             * An action must be a function
             * the property will overwrite the one has same name in prorotype chain.
             */
            if( typeof proto?.[ key ] !== 'function' ) {
                overwritten.add( key );
                return;
            }
            const descriptor = Reflect.getOwnPropertyDescriptor( proto, key );
            if( !descriptor )
                return;
            /**
             * scan all actions are exposed by @Action() decorator
             */
            Reflect.getMetadata( constants_1.ACTION_METADATA_KEY, descriptor.value )?.forEach( ( name ) => {
                actions[ name ] = {
                    proto : proto,
                    methodName : key,
                    descriptor
                };
            } );
            /**
             * scan all methods whose name end withs 'Action'
             */
            if( typeof key === 'string' && key.endsWith( constants_1.ACTION_METHOD_SUFFIX ) ) {
                const name = key.substr( 0, key.length - ACTION_METHOD_SUFFIX_LENGTH );
                /**
                 * the action method that exposed with @Action() decorator has high precedence.
                 * indexAction should not override @Action( 'index' )
                 */
                if( hasOwn( name ) )
                    return;
                actions[ name ] = { methodName : key, descriptor, proto };
            }
        } );
        proto = Reflect.getPrototypeOf( proto );
    }
    return actions;
}
exports.scan = scan;
/**
 * create action executor functions for every action function in specific controller.
 */
function createExecutors( mountingPath, Controller ) {
    const executors = {};
    const actionInfos = scan( Controller.prototype );
    const afters = [];
    const befores = [];
    const exceptions = [];
    for( const item of mountingPath ) {
        const Constructor = item.module ?? item.constructor;
        const [ after, before, exception ] = create_abe_interceptors_1.createABEInterceptors( Constructor );
        afters.push( after );
        befores.push( before );
        exceptions.push( exception );
    }
    const [ controllerAfter, controllerBefore, controllerException ] = create_abe_interceptors_1.createABEInterceptors( Controller );
    afters.push( controllerAfter );
    befores.push( controllerBefore );
    exceptions.push( controllerException );
    Object.keys( actionInfos ).forEach( ( actionName ) => {
        const info = actionInfos[ actionName ];
        const { descriptor, methodName, proto } = info;
        const [ after, before, exception ] = create_abe_interceptors_1.createABEInterceptors( descriptor );
        const parameter = method_interceptor_1.createInterceptorParameter( proto, methodName );
        const metadataParameter = method_interceptor_1.getMetadataParameter( proto, methodName );
        const paramtypes = Reflect.getMetadata( 'design:paramtypes', proto, methodName );
        const controllerParameter = method_interceptor_1.createInterceptorParameter( Controller );
        const controllerMetadataParameter = method_interceptor_1.getMetadataParameter( Controller );
        const controllerParamtypes = Reflect.getMetadata( 'design:paramtypes', Controller );
        executors[ actionName ] = async ( context ) => {
            return Promise.all( [ before( context ), ...befores.map( async ( item ) => item( context ) ) ] ).then( async () => {
                const controllerParams = await fill_params_1.fillParams( await controllerParameter( context ), controllerMetadataParameter, controllerParamtypes, [ context ] );
                const params = await fill_params_1.fillParams( await parameter( context ), metadataParameter, paramtypes, [ context ] );
                const response = new Controller( ...controllerParams )[ methodName ]( ...params );
                let res = after( response, context );
                for( let i = afters.length - 1; i > 0; i -= 1 ) {
                    res = res.then( async ( val ) => afters[ i ]( val, context ) );
                }
                return res;
            } ).catch( async ( e ) => {
                let promise = exception( e, context );
                for( let i = exceptions.length - 1; i > 0; i -= 1 ) {
                    promise = promise.catch( async ( e ) => exceptions[ i ]( e, context ) );
                }
                return promise;
            } );
        };
    } );
    return executors;
}
exports.createExecutors = createExecutors;
