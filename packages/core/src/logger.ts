/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: logger/index.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/01/2020
 * Description: 
 ******************************************************************/


/**
 * Simple function for logging which has arguments just matches util.format method in nodejs.
 */
export type LogFunction = ( msg: any, ...args: any[] ) => any;

export default interface Logger {
    log: LogFunction;
    error: LogFunction;
    warn: LogFunction;
    debug?: LogFunction;
    verbose?: LogFunction;
}
