/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/context.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

import { IncomingMessage, ServerResponse } from 'http';
import { Request } from './request';
import { Response } from './response';

export interface Context {
    req?: IncomingMessage;
    res?: ServerResponse;

    request: Request;
    response: Response;

    params: Record<string, string>;
    matches: [ string | undefined ][];

    logger: Logger;
    debug: Logger;

    startTime: number;
    throw: ( ...args: Parameters<typeof httpErrors> ) => void;
    inspect: unknown;
    toJSON: Record<string, unknown>;
}
