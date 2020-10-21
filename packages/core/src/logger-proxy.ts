/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: src/logger-proxy.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 10/21/2020
 * Description: 
 ******************************************************************/

import Logger from './logger';

export type LoggerProxyOptions = {
    debugging?: boolean;
    logging?: boolean;
    logger?: Logger;
}

export default ( logger: Logger, options: LoggerProxyOptions = {} ) => {
    const { debugging = true, logging = false, logger } = options;

    return new Proxy<Logger>( logger, {
        get( logger: Logger, method: string ): ( ...args: any[] ) => any {
            if( !debugging
        }
    } );
}
