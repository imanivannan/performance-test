const TestEvent = require('./TestEvents');
const moment = require('moment');
const today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
const  {EVENT_REQUEST,EVENT_REPLY}   = require('../socketio/SocketIOEvents');
const Log = require('../log/Log.js');
const CLASS_NAME="[TestDao] ";
function TestDao(connected_socket)
{
      Log.trace(CLASS_NAME,'New Socket '+connected_socket.id);
      Log.trace(CLASS_NAME,"In the Constructor  "+connected_socket.id);
      socket=connected_socket;
      socketID=socket.id;
      connected_socket.on(EVENT_REQUEST,respondWithInitialData);
      // Remove the user socket id
      connected_socket.on('disconnect', () => {
        Log.trace(CLASS_NAME+' Socket Disconnected '+socketID);
            socket=null;
      });
      Log.trace("Finished registering event listeners " +socket.id);
}






function respondWithInitialData()
{
    Log.trace(CLASS_NAME,'Request Received');
    var docs = TestEvent.generateInitialData();
    Log.trace(CLASS_NAME,'Responding with '+docs.length+' rows'+' on Event'+EVENT_REPLY);
    socket.emit(EVENT_REPLY, docs);
}


module.exports = TestDao;

  