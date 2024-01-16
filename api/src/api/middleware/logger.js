const { transports, createLogger, format } = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');
const { combine, prettyPrint, timestamp, json } = format;

module.exports = (logFile = '/app.log', logStream = 'General') => createLogger({
    format: combine(
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new CloudWatchTransport({
            logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP,
            logStreamName: logStream,
            awsOptions: {
                credentials: {
                    accessKeyId: process.env.AWS_CLOUDWATCH_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_CLOUDWATCH_SECRET_KEY,
                },
                region: 'us-east-2',
            },
            jsonMessage: true,
            //messageFormatter: item => `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`
        }),
        new transports.File({filename: global.config.LOG_FOLDER + `${logFile}`}),
        //new transports.Console(),
    ]
})
