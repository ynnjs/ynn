module.exports = {
    path : 'log',
    'access-log' : {
        dailyrotate : true,
        filename : 'access-%DATE%.log',
        datePattern : 'YYYY-MM-DD',
        maxSize : '30m',
        maxFiles : '30d'
    },
    'rsc-log' : {
        dailyrotate : true,
        filename : 'rsc-%DATE%.log',
        datePattern : 'YYYY-MM-DD',
        maxSize : '30m',
        maxFiles : '30d'
    },
    levels : {
        info : {
            dailyrotate : true,
            filename : 'info-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        },

        warn : {
            dailyrotate : true,
            filename : 'warn-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        },

        error : {
            dailyrotate : true,
            filename : 'error-%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '30d'
        }
    }
};
