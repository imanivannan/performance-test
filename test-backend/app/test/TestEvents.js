
const Log = require('../log/Log.js');
const SocketIOController = require('./SocketIOController.js');
const CLASS_NAME="[TestEvent] ";

// Consumer instance

const TOTAL_ROWS=10000;
const EVENT_PERIOD=500;
var eventCount = TOTAL_ROWS;
var rows=TOTAL_ROWS;
const SEND_EVENT=true;



const timerHandler =  function () {
    
    if(!SEND_EVENT)
    {
        return;
    }
    var even = (eventCount % 2 === 0);
    eventCount=eventCount+1;
    if(even)
    {
        rows = rows+1;        
        fireInsertEvent(rows);
    }
    else
    {
        var sequenceToUpdate = Math.floor(Math.random() * rows) + 1;
        fireUpdateEvent(sequenceToUpdate);
    }
    
}

function fireUpdateEvent (id) {
    
    var event = generateObject(id);
    var mod5 = (id % 5 === 0);
    event.time=new Date();    
    event.city='New York';
    if(mod5)
    {
        event.testState='EVEN';
    }
    SocketIOController.broadCastToSockerIO(event);
    Log.trace(CLASS_NAME,"UpdateEvent for Id="+id+" Event Count="+eventCount);

}

function fireInsertEvent (id) {
    var event = generateObject(id);
    SocketIOController.broadCastToSockerIO(event);
    Log.trace(CLASS_NAME,"InsertEvent for Id="+id+" Event Count="+eventCount);
}

function generateObject(seq)
{
    var even = (seq % 2 === 0);
    var obj = {id:seq,firstName:"John "+seq,lastName:"Smith "+seq,age:seq+25,city:even?"Charlotte":"London",time:new Date(),testState:even?"EVEN":"ODD"};
    return obj;
}




const timerId = setInterval(timerHandler,EVENT_PERIOD);
Log.trace(CLASS_NAME,"Timer Started "+timerId);

module.exports = {
    generateInitialData : () =>
    {
        var i=TOTAL_ROWS;
        var docs = new Array(i);
        
        for (i = 0; i < docs.length; i++) {
            docs[i]=generateObject(i);
        }
        return docs;
    }
}
