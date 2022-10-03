const {createLogger, format, transports} = require('winston');
const { combine, splat, timestamp, printf } = format;
const {levels}= require('./levels');

const format_ = printf( ({ level, message, timestamp}) => {
    let msg = `${timestamp} [${level}] : ${message} `;  
    return msg;
  });
  const timeFormat = () => {return new Date().toLocaleString('es-CO', {timeZone: 'America/Bogota'});}

  module.exports =
  createLogger({
      format: combine(
          format.colorize(),
          splat(),
          timestamp({format:timeFormat}),
          format_
      ),
      exitOnError:false,
      transports:[
          new transports.Console(),
          new transports.File({filename:`${__dirname}/../Logs/server-info.log`,level:'info'}),
          new transports.File({filename:`${__dirname}/../Logs/server-exceptions.log`,level:'error'}),
      ],
  });
