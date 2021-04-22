/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: test/match.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 04/22/2021
 * Description:
 ******************************************************************/

describe( '', () => {

    const context = createContext();

    const metadata = ( property = 'id', pipes: Pipe[] = [] ): ParameterMetadata => {
        return createParameterMetadata( {
            parameters : { property, pipes }
        } );
    };

    describe( 'default exception', () => {
        
    } );

    
} );
