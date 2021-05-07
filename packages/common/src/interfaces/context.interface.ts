/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/context.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/29/2021
 * Description:
 ******************************************************************/

import { IncomingMessage, ServerResponse } from 'http';
import { Logger } from './logger.interface';
import { Request } from './request.interface';
import { Response } from './response.interface';

export interface Context {
    req?: IncomingMessage;
    res?: ServerResponse;

    request: Request;
    response: Response;

    params: Record<string, string>;
    matches: [ string | undefined ][];

    logger: Logger;

    startTime: bigint;
    inspect: unknown;
    toJSON: () => Record<string, unknown>;
}
