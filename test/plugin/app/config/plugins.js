/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: config/plugins.js
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 06/29/2021
 * Description:
 ******************************************************************/

const redis = require( '../plugin/redis' );

module.exports = {
	redis : './plugin/redis.js',
    'another-redis' : {
        path : './plugin/redis.js',
        options : {
            name : 'another-redis'
        }
    },
    ExtendsPlugin : {
        path : './plugin/test.js',
        options : {
            plugin : 'OK'
        }
    },
    OrdinaryClass : {
        path : './plugin/class.js'
    },
    'redis-again' : {
        plugin : redis,
        options : {
            name : 'redis-again'
        }
    }
};
