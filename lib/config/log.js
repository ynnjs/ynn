module.exports = {
    info : {
        dailyrotate : true,
        filename : '%DATE%.log',
        datePattern : 'YYYY-MM-DD',
        maxSize : '20m',
        maxFiles : '30d'
    },

    warning : {
        dailyrotate : true,
        filename : 'warning-%DATE%.log',
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
};
