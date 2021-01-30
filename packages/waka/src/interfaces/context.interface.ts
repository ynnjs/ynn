/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/context.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/28/2021
 * Description:
 ******************************************************************/

import fs from 'fs';
import { IncomingMessage } from 'http';

export interface Context {
    req: IncomingMessage;
    request: Request;
    response: Response;
    throw: ( ...args: unknown[] ) => void;
    cookies: Record<string, string>;
    headers: Record<string, string>;
    body?: unknown;
}
