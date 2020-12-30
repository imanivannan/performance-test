import socket from "../events/SocketConnection";
import SocketIOEvents from "../events/SocketIOEvents";
var TestService = (function () {
  var instance;

  function createInstance() {
      var object = new TestServiceClass();
      return object;
  }

  return {
      getInstance: function () {
          if (!instance) {
              instance = createInstance();
          }
          return instance;
      }
  };
})();

class TestServiceClass
{
  testMap = new Map();
  constructor() {
    socket.on(SocketIOEvents.EVENT_MESSAGES, (data) => this.bondEventHandler(data));
    console.log("Subscribed to Bond Messages");
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  async getBondData(cusip) 
  {
    if(this.bondMap.has(cusip))
    {
      console.log('We got this');
      return this.bondMap.get(cusip);
    }
    else{
      var missingBonds = new Array(0);
      if(cusip && cusip!==null && cusip !== "")
      {
        missingBonds.push(cusip);
        console.log('Requesting Backend with '+cusip);
        socket.emit(SocketIOEvents.EVENT_BOND_REQUEST,SocketIOEvents.EVENT_BOND_REPLY,missingBonds);
        socket.on(SocketIOEvents.EVENT_BOND_REPLY, async (data) => { this.bondReplyHandler(data)});
        console.log('Waiting');      
      }     
      await this.sleep(TimerConfig.TIME_FOR_EVENT_FETCH);
      var bond =  this.bondMap.get(cusip);
      if(bond)
      {
        console.log('Got this now '+bond.cusip);
      }
      return bond;
     }
  }


  async getDataList() 
  {
      socket.emit(SocketIOEvents.EVENT_REQUEST);
      socket.on(SocketIOEvents.EVENT_REPLY, async (data) => { this.testReplyHandler(data)});
      await this.sleep(2000);
      console.log('Data Size is '+this.testMap.size);
      let values =[ ...this.testMap.values() ];
      return values;
      
    }
  }
 
  testEventHandler(data)
  {
    console.log('Got Test Event for '+data.id);
    this.testMap.set(data.id,data);
  }
  testReplyHandler(data)
  {
    console.log('Got Data List '+data.length);
    data.forEach(bond => {
      this.testMap.set(bond.id,bond);
    }); 
    console.log('Added to Data Map Size Now is '+this.testMap.size);
    socket.off(SocketIOEvents.EVENT_REPLY);
  }
}
export default TestService;