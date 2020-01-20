/**
 * Should be replaced with custom logger
 */

'use strict'

const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const config = require('./config')
const fs = require('fs')
const path = require('path')
const util = require('util')

const env = config.env || 'development'
const logDir = path.join(__dirname, 'logs')

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const dailyRotateFileTransportResults = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})

const dailyRotateFileTransportErrors = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-errors.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})

const logger = createLogger({
    // To the file
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(info =>
            util.format(info.timestamp, info.level, info.message)
        )
    ),

    // On the screen
    transports: [
        new transports.Console({
            level: env === 'development' ? 'debug' : 'info',
            format: format.combine(
                format.colorize(),
                format.printf(info => 
                    util.format(info.timestamp, info.level, info.message))
            )
        }),
        dailyRotateFileTransportResults
    ],
    exceptionHandlers: [
        new transports.Console({
            level: 'error',
            format: format.combine(
                format.colorize(),
                format.printf(info =>
                    util.format(info.timestamp, info.level, info.message))
            )
        }),
        dailyRotateFileTransportErrors
    ]
})

module.exports = logger

// throw new Error('error')
// logger.debug('Debugging info')
// logger.verbose('Verbose info')
// logger.info('Hello world')
// logger.warn('Warning message')
// logger.error('Error info')

/**
 * const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
 */
