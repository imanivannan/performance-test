const debug = require('debug');

const BASE = 'test';
const COLOURS = {
  trace: 'lightblue',
  info: 'blue',
  warn: 'pink',
  error: 'red'
}; // choose better colours :)

const DEBUG_ENABLED=true;
class Log 
{
  generateMessage(level, message, source) {
    // Set the prefix which will cause debug to enable the message
    const namespace = `${BASE}:${level}`;
    const createDebug = debug(namespace);
    createDebug.enabled=true;
    // Set the colour of the message based on the level
    createDebug.color = COLOURS[level];
    
    if(source) {
       return createDebug(source, message); 
      }      
    else 
    { 
      return createDebug(message); 
    }
  }
  
  /**
  trace(message, source) {
    const mydebug = this.generateMessage('trace', message, source);
    mydebug();
  }
  
  info(message, source) {
    return this.generateMessage('info', message, source);
  }
  
  warn(message, source) {
    return this.generateMessage('warn', message, source);
  }
  
  error(message, source) {
    return this.generateMessage('error', message, source);
  }

 */
  trace(source,message) {
    if(DEBUG_ENABLED)console.log('['+source+'] '+message);
  }
  
  info(source,message) {
    if(DEBUG_ENABLED)console.log('['+source+'] '+message);
  }
  
  warn(source,message) {
    if(DEBUG_ENABLED)console.log('['+source+'] '+message);
  }
  
  error(source,message) {
    console.log('['+source+'] '+message);
  }


}
const log = new Log();
module.exports = log
