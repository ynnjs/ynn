/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/logger.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

export interface LogFunction {
    ( msg: unknown, ...args: unknown[] ): unknown;
}

export interface Logger {
    log: LogFunction;
    error: LogFunction;
    warn: LogFunction;
    debug: LogFunction;
}
