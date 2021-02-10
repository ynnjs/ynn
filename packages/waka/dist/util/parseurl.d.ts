/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/parseurl.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/09/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import { parse } from 'url';
export declare function parseurl(url: string): ReturnType<typeof parse>;
