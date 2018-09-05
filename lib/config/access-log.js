module.exports = {
    dailyrotate : true,
    filename : 'access-%DATE%.log',
    datePattern : 'YYYY-MM-DD',
    maxSize : '30m',
    maxFiles : '30d'
};
