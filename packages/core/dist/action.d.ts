/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/action.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/02/2020
 * Description:
 ******************************************************************/
import { VariadicClass } from '@ynn/utility-types';
import { Ynn } from './ynn';
import { Context } from './context';
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
    proto: object;
}
/**
 * generate the `@Action` decorator which is used to mark a instance method to be an `Action`.
 *
 * @param name - the `Action`'s name, using the method name by default.
 *
 * @return a method decorator
 */
export declare function Action( name?: string ): MethodDecorator;
export declare function scan( obj: object ): Record<string, ActionInfo>;
export declare type Executor = ( context: Context ) => unknown;
/**
 * create action executor functions for every action function in specific controller.
 */
export declare function createExecutors( mountingPath: Ynn[], Controller: VariadicClass ): Record<string, Executor>;
