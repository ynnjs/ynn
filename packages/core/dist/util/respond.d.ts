/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/respond.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/16/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Context } from '../context';
export declare function respond( ctx: Context, req: IncomingMessage, res: ServerResponse ): void;
