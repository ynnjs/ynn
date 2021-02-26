/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: src/parse-url.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 02/25/2021
 * Description:
 ******************************************************************/
/// <reference types="node" />
import { URL } from 'url';
import { Context } from '@ynn/core';
import { Metadata } from '@ynn/common';
export declare function ParseURL(url: string, ctx: Context, metadata: Metadata): URL;
