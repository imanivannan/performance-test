const io = require('../socketio/SocketIO').io;
const TEST_NAMESPACE = require('../socketio/SocketIO').TEST_NAMESPACE;
const EVENT_MESSAGES = require('..//socketio/SocketIOEvents').EVENT_MESSAGES;
/**
 * Controller constructor
 */
function SocketIOController() {}

/**
 * Update the data in database
 * @param {*} payload 
 */
SocketIOController.broadCastToSockerIO = function (payload) {
      // Parse the payload
      try {
            io.of(TEST_NAMESPACE).emit(EVENT_MESSAGES,payload);

      } catch (error) {
            console.log(error);
            console.log('Error while parsing');
            return;
      }

}
module.exports = SocketIOController;