/**************************************************
 * Author  : Jihyuck Yun (dr.jhyun@gmail.com)     *
 *           Baegjae Sung (baegjae@gmail.com)     *
 * since August 01, 2020                          *
 **************************************************/

'use strict'

const { createLogger, format, transports } = require('winston')
const { label } = format

const prettyFormatter = format.combine(
    format.printf(
        info => `${info.label}[${info.timestamp}] [${info.level}]: ${info.message}`
    )
)

const logger = createLogger({
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
  format: format.combine(
      label({ label: '' }),
      format.colorize({ all: true }),
      format.timestamp({ format: 'MM-DD HH:mm:ss' }),
      prettyFormatter
  ),
  transports: [
    new transports.Console()
  ]
})

module.exports = logger