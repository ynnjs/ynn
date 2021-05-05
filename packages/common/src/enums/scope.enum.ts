/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: enums/scope.enum.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/04/2021
 * Description:
 ******************************************************************/

export enum Scope {
    /**
     * The provider can be shared across multiple classes and the instance will be created at the service start.
     */
    DEFAULT,
    /**
     * The provider can be shared across multiple classes and the instance will be created at the first time the provider been called.
     */
    DEFERRED,
    /**
     * A new instance for seperate modules
     */
    MODULE,
    /**
     * A new instance is instantiated for each request processing pipeline
     */
    REQUEST,
    /**
     * reuse the instance in the same situation
     */
    ISOLATED,
    /**
     * A new private instance of the provider is instantiated for every use
     */
    TRANSIENT
}
