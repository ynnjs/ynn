/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: interfaces/exception-response-object.interface.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 05/05/2021
 * Description:
 ******************************************************************/

import { HttpExceptionResponse } from '@ynn/exceptions';

export type ExceptionResponseObject = Exclude<HttpExceptionResponse, number | string>;
