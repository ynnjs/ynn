/******************************************************************
 * Copyright (C) 2020 LvChengbin
 *
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description:
 ******************************************************************/
import { Logger } from './interfaces';
export declare type LoggerProxyOptions<T = Logger> = {
    debugging: boolean | string[];
    logging: boolean | string[];
    logger?: T;
    debug: T;
};
export default function loggerProxy<T extends Logger>( options: Readonly<LoggerProxyOptions<T>> ): T;
