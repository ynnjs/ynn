/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/metadata.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/10/2021
 * Description:
 ******************************************************************/

import 'reflect-metadata';
import {
    KEY_BEFORE, saveMetadataBefore, getMetadataBefore,
    KEY_AFTER, saveMetadataAfter, getMetadataAfter,
    KEY_EXCEPTION, saveMetadataException, getMetadataException,
    KEY_FINALLY, saveMetadataFinally, getMetadataFinally,
    KEY_PARAMETER, saveMetadataParameter, getMetadataParameter
} from '../src';
import { generateDescriptor } from './helpers/util';

describe( 'methods of metadata', () => {
    describe( 'metadata before', () => {
        it( 'save "before" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataBefore( A, fn );
            const metadata = Reflect.getMetadata( KEY_BEFORE, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save "before" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataBefore( descriptor, fn );
            const metadata = Reflect.getMetadata( KEY_BEFORE, descriptor.value );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save multiple "before" metadtas', () => {
            class A {}
            const fn = () => {};
            saveMetadataBefore( A, fn );
            saveMetadataBefore( A, fn );
            const metadata = Reflect.getMetadata( KEY_BEFORE, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                type : expect.any( Symbol )
            }, {
                interceptorType : 'before',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'set "parameters" option for "before" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataBefore( A, fn, {
                parameters : { x : 1 }
            } );
            const metadata = Reflect.getMetadata( KEY_BEFORE, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                parameters : { x : 1 },
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "before" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataBefore( A, fn );
            const metadata = getMetadataBefore( A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "before" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataBefore( descriptor, fn );
            const metadata = getMetadataBefore( descriptor );
            expect( metadata ).toEqual( [ {
                interceptorType : 'before',
                type : expect.any( Symbol )
            } ] );
        } );
    } );

    describe( 'metadata after', () => {
        it( 'save "after" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataAfter( A, fn );
            const metadata = Reflect.getMetadata( KEY_AFTER, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save "after" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataAfter( descriptor, fn );
            const metadata = Reflect.getMetadata( KEY_AFTER, descriptor.value );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save multiple "after" metadtas', () => {
            class A {}
            const fn = () => {};
            saveMetadataAfter( A, fn );
            saveMetadataAfter( A, fn );
            const metadata = Reflect.getMetadata( KEY_AFTER, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                type : expect.any( Symbol )
            }, {
                interceptorType : 'after',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'set "parameters" option for "after" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataAfter( A, fn, {
                parameters : { x : 1 }
            } );
            const metadata = Reflect.getMetadata( KEY_AFTER, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                parameters : { x : 1 },
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "after" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataAfter( A, fn );
            const metadata = getMetadataAfter( A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "after" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataAfter( descriptor, fn );
            const metadata = getMetadataAfter( descriptor );
            expect( metadata ).toEqual( [ {
                interceptorType : 'after',
                type : expect.any( Symbol )
            } ] );
        } );
    } );

    describe( 'metadata exception', () => {
        it( 'save "exception" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataException( A, fn );
            const metadata = Reflect.getMetadata( KEY_EXCEPTION, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save "exception" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataException( descriptor, fn );
            const metadata = Reflect.getMetadata( KEY_EXCEPTION, descriptor.value );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save multiple "exception" metadtas', () => {
            class A {}
            const fn = () => {};
            saveMetadataException( A, fn );
            saveMetadataException( A, fn );
            const metadata = Reflect.getMetadata( KEY_EXCEPTION, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            }, {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'set "parameters" option for "exception" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataException( A, fn, {
                parameters : { x : 1 }
            } );
            const metadata = Reflect.getMetadata( KEY_EXCEPTION, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                parameters : { x : 1 },
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "exception" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataException( A, fn );
            const metadata = getMetadataException( A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "exception" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataException( descriptor, fn );
            const metadata = getMetadataException( descriptor );
            expect( metadata ).toEqual( [ {
                interceptorType : 'exception',
                type : expect.any( Symbol )
            } ] );
        } );
    } );

    describe( 'metadata finally', () => {
        it( 'save "finally" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataFinally( A, fn );
            const metadata = Reflect.getMetadata( KEY_FINALLY, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save "finally" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataFinally( descriptor, fn );
            const metadata = Reflect.getMetadata( KEY_FINALLY, descriptor.value );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'save multiple "finally" metadtas', () => {
            class A {}
            const fn = () => {};
            saveMetadataFinally( A, fn );
            saveMetadataFinally( A, fn );
            const metadata = Reflect.getMetadata( KEY_FINALLY, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            }, {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'set "parameters" option for "finally" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataFinally( A, fn, {
                parameters : { x : 1 }
            } );
            const metadata = Reflect.getMetadata( KEY_FINALLY, A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                parameters : { x : 1 },
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "finally" metadata for a constructor', () => {
            class A {}
            const fn = () => {};
            saveMetadataFinally( A, fn );
            const metadata = getMetadataFinally( A );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            } ] );
        } );

        it( 'get "finally" metadata for a descriptor', () => {
            const fn = () => {};
            const descriptor = generateDescriptor();
            saveMetadataFinally( descriptor, fn );
            const metadata = getMetadataFinally( descriptor );
            expect( metadata ).toEqual( [ {
                interceptorType : 'finally',
                type : expect.any( Symbol )
            } ] );
        } );
    } );

    describe( 'metadata parameter', () => {
        it( 'save "parameter" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataParameter( A, 'fn', 0, fn );
            const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
            expect( metadata ).toEqual( [ [
                { interceptorType : 'parameter', type : expect.any( Symbol ) }
            ] ] );
        } );

        it( 'save mutliple "parameter" metadatas for same parameter', () => {
            class A {}
            const fn = () => {};
            saveMetadataParameter( A, 'fn', 0, fn );
            saveMetadataParameter( A, 'fn', 0, fn );
            const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
            expect( metadata ).toEqual( [ [
                { interceptorType : 'parameter', type : expect.any( Symbol ) },
                { interceptorType : 'parameter', type : expect.any( Symbol ) }
            ] ] );
        } );

        it( 'save "parameter" metadatas for multiple parameters', () => {
            class A {}
            const fn = () => {};
            saveMetadataParameter( A, 'fn', 0, fn );
            saveMetadataParameter( A, 'fn', 1, fn );
            const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
            expect( metadata ).toEqual( [ [
                { interceptorType : 'parameter', type : expect.any( Symbol ) }
            ], [
                { interceptorType : 'parameter', type : expect.any( Symbol ) }
            ] ] );
        } );

        it( 'save "parameter" metadata with "parameters" option', () => {
            class A {}
            const fn = () => {};
            saveMetadataParameter( A, 'fn', 0, fn, {
                parameters : { x : 1 }
            } );
            const metadata = Reflect.getMetadata( KEY_PARAMETER, A, 'fn' );
            expect( metadata ).toEqual( [ [
                { interceptorType : 'parameter', type : expect.any( Symbol ), parameters : { x : 1 } }
            ] ] );
        } );

        it( 'get "parameter" metadata', () => {
            class A {}
            const fn = () => {};
            saveMetadataParameter( A, 'fn', 0, fn, {
                parameters : { x : 1 }
            } );
            const metadata = getMetadataParameter( A, 'fn' );
            expect( metadata ).toEqual( [ [
                { interceptorType : 'parameter', type : expect.any( Symbol ), parameters : { x : 1 } }
            ] ] );
        } );
    } );
} );
