/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/logger.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/03/2021
 * Description:
 ******************************************************************/

export interface LogMethod {
    ( msg: any, ...args: any[] ): any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Logger {
    error: LogMethod;
    warn: LogMethod;
    info: LogMethod;
    debug?: LogMethod;
    trace?: LogMethod;
}
