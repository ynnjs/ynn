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
    }
};
