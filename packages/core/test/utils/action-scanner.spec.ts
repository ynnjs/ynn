/******************************************************************
 * Copyright (C) 2020 LvChengbin
 * 
 * File: utils/action-scanner.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 11/30/2020
 * Description: 
 ******************************************************************/

import 'reflect-metadata';
import scanner from '../../src/utils/action-scanner';

describe( 'utils.scanner', () => {

    it( 'should pick methods whose name ends with "Action"', () => {
        const controller = {
            indexAction() {}
        }

        const actions = scanner( controller );

        console.log( actions );
    } );
} );
