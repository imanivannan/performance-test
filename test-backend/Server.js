// External Modules
const process = require('process');
const { io, httpServer,TEST_NAMESPACE}  = require('./app/socketio/SocketIO.js');
require('./app/test/TestEvents.js');
const socketioConfig = require('./app/config/socketio.config.js'); 
const TestDao = require('./app/test/TestDao.js');
const Log = require('./app/log/Log.js');

const CLASS_NAME="Sever";

const testSocket= io.of(TEST_NAMESPACE);
testSocket.on('connection', (connected_socket) => {      
      new TestDao(connected_socket);
});
     

httpServer.listen(socketioConfig.LISTEN_PORT,'0.0.0.0', () => {
      Log.trace(CLASS_NAME,"Server started on "+socketioConfig.LISTEN_PORT);
});

process.on('SIGINT', function onSigint() {
      shutdown();
});
    
process.on('SIGTERM', function onSigterm() {
      shutdown();
});
    
function shutdown(){
      httpServer.close(function onServerClosed(err) {
            if (err) {
              Log.trace(CLASS_NAME,'An error occurred while closing the server: ' + err);
              process.exitCode = 1;
            }
          });
          process.exit();
}
    

