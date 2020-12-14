/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: decorators/ctx.decorator.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 12/03/2020
 * Description: 
 ******************************************************************/

import Pipe from '../interfaces/pipe.interface';
import { createActionDecorator } from './util';

export default function Ctx(): ParameterDecorator;

export default function Ctx( property: string ): ParameterDecorator;

export default function Ctx( pipe: Pipe ): MethodDecorator & ParameterDecorator;

export default function Ctx( property: string, pipe: Pipe ): MethodDecorator & ParameterDecorator;

export default function Ctx( ...args: [ (string | Pipe)?, Pipe? ] ): MethodDecorator & ParameterDecorator {
    return createActionDecorator( 'ctx', ...args );
}
