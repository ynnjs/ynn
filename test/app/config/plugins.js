module.exports = {
    redis : './plugins/redis.js',
    'another-redis' : {
        path : './plugins/redis.js',
        options : {
            name : 'another-redis'
        }
    },
    ExtendsPlugin : {
        path : './plugins/test.js',
        options : {
            plugin : 'OK'
        }
    },
    OrdinaryClass : {
        path : './plugins/ordinary-class.js'
    }
};
