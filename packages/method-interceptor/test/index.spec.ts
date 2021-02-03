/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/index.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/27/2021
 * Description:
 ******************************************************************/

import {
    MetadataBefore, MetadataAfter, MetadataException, MetadataParameter,
    createDecoratorAfter, createInterceptorAfter,
    createDecoratorBefore, createInterceptorBefore,
    createDecoratorException, createInterceptorException,
    createDecoratorParameter, createInterceptorParameter
} from '../src';

describe( 'method-interceptor', () => {

    describe( 'full features', () => {
        interface Context {
            query: Record<string, string>;
            header: Record<string, string>;
        }

        interface UserInfo {
            name: string;
            level: number;
            password: string;
        }

        interface ErrorResponse {
            status: number;
        }

        class CustomError extends Error {}

        const Authorization = createDecoratorBefore( async ( metadata: MetadataBefore, ctx: Context ): Promise<UserInfo> => {
            const { header } = ctx;
            if( !header.authorization ) {
                throw new Error( 'Not login' );
            }
            return { name : 'admin', level : 9, password : 'abcdefg' };
        } );

        const User = createDecoratorParameter( async ( metadata: MetadataParameter, ctx: Context ): Promise<UserInfo> => {
            const { query } = ctx;
            if( !query.uid ) {
                throw new Error( 'uid is requierd' );
            }
            return { name : 'Jolin', level : 1, password : '1234567' };
        } );

        const Exception = createDecoratorException( async ( metadata: MetadataException, e: unknown, ctx: Context ): Promise<ErrorResponse & { query: Record<string, string> }> => {
            if( e instanceof CustomError ) throw e;
            return {
                status : 1,
                query : ctx.query
            };
        } );

        const Purification = createDecoratorAfter( async <T>( metadata: MetadataAfter, value: T, ctx: Context ): Promise<Omit<T, 'password'>> => {
            if( ctx.query.forceError ) {
                throw new CustomError( 'Custom error' );
            }
            delete ( value as any ).password; // eslint-disable-line @typescript-eslint/no-explicit-any
            return value;
        } );

        class Controller {
            @Exception
            @Authorization
            @Purification
            action( @User user: UserInfo ) {
                return user;
            }
        }

        const descriptor = Reflect.getOwnPropertyDescriptor( Controller.prototype, 'action' )!;

        const before = createInterceptorBefore( descriptor );
        const after = createInterceptorAfter( descriptor );
        const exception = createInterceptorException( descriptor );
        const parameter = createInterceptorParameter( Controller.prototype, 'action' );

        async function execute( context: Context ): Promise<unknown> {
            try {
                await before( context );
                const controller = new Controller();
                const params = await parameter( context );
                const body = controller.action( ...params as [ UserInfo ] );
                return await after( body, context );
            } catch( e: unknown ) {
                return exception( e, context );
            }
        }

        it( 'all the best', async () => {
            const context: Context = {
                query : { uid : '123' },
                header : { authorization : 'authorization' }
            };

            return expect( execute( context ) ).resolves.toEqual( { name : 'Jolin', level : 1 } );
        } );

        it( 'throw exception from before interceptor', async () => {
            const context: Context = {
                query : { uid : '123' },
                header : {}
            };

            return expect( execute( context ) ).resolves.toEqual( { status : 1, query : { uid : '123' } } );
        } );

        it( 'throw exception from parameter interceptor', async () => {
            const context: Context = {
                query : {},
                header : { authorization : 'authorization' }
            };

            return expect( execute( context ) ).resolves.toEqual( { status : 1, query : {} } );
        } );

        it( 'throw exception from after interceptor', async () => {
            const context: Context = {
                query : { uid : '123', forceError : '1' },
                header : { authorization : 'authorization' }
            };

            return expect( execute( context ) ).rejects.toBeInstanceOf( CustomError );
        } );

    } );
} );
