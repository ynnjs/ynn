/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: decorators/header.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/09/2020
 * Description:
 ******************************************************************/
/// <reference types="node" />
import { OutgoingHttpHeaders } from 'http';
import { Pipe } from '../interfaces';
/**
 * set response header with property: value
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( 'X-Custom-Header', 'value' )
 *         index() {}
 *     }
 * ```
 *
 * @param property - key of header
 * @param value - value of header
 *
 * @return a method decorator
 */
export declare function Header(property: string, value: string): MethodDecorator;
/**
 * set response headers with an Object
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( { 'X-Custom-Header' : 'value', 'Content-Type' : 'application/json' } )
 *         index() {}
 *     }
 * ```
 *
 * @param headers - the object of headers
 *
 * @return a method decorator
 */
export declare function Header(headers: OutgoingHttpHeaders): MethodDecorator;
/**
 * Get request header with it's name
 *
 * @example
 *
 * ```ts
 *     class Controller {
 *         @Action()
 *         @Header( 'X-Custom-Header' )
 *         index() {}
 *     }
 * ```
 */
export declare function Header(property: string): ParameterDecorator;
export declare function Header(...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
export declare function Header(property: string, ...pipes: Pipe[]): ParameterDecorator & MethodDecorator;
