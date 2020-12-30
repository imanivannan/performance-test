import cloneDeep from "lodash/cloneDeep";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import socket from "../../events/SocketConnection";
import SocketIOEvents from "../../events/SocketIOEvents";
import { TestThunk } from "../..";
import Log from "../../log/Log";

export const TEST_CATEGORY="test";

const CLASS_NAME:string="TestSlice";

export interface TestStoreState {
 docs: any[];
 testEvent: any;
 initial:boolean;
}

const initialState: TestStoreState = {
    docs: [],
    testEvent: null,
    initial:false
}

const testSlice = createSlice({
    name: TEST_CATEGORY,
    initialState,
    reducers: {
 
        initialDataReceived: (state, { payload }: PayloadAction<Array<any>>) => {
            Log.trace(CLASS_NAME,'initialDataReceived '+payload.length); 
            state.docs = payload;
            state.initial=true;
            return state;
        },
        eventReceived: (state, { payload }: PayloadAction<any>) => {
              Log.trace(CLASS_NAME+" [Reducer]",'eventReceived '+payload.id); 
              var t1 = performance.now();
              var objIndex = state.docs.findIndex((obj => obj.id === payload.id));
              if(objIndex!==-1) 
            {
                Log.trace(CLASS_NAME+" [Reducer]","[EXIST]=>"+state.docs[objIndex].testId+"="+state.docs[objIndex].testState+", [UPDATE]=>"+payload.testId+"="+payload.testState);
                state.docs[objIndex] = payload;
            } 
            else
            {
                Log.trace(CLASS_NAME+" [Reducer]"," New Row added "+payload.id);
                state.docs.push(payload);                            
            } 

            var t2 = performance.now();
            Log.trace(CLASS_NAME+" [Reducer]",'Event Processed '+payload.id+' in '+(t2-t1)+' ms, with '+state.docs.length+' rows ' ); 
            return state;
        },
        updateTime: (state) => {
            Log.trace(CLASS_NAME+" [Reducer]",'updateTime '); 
            var t1 = performance.now();
            state.docs.forEach(function(element, index) {
                element.time=new Date().toISOString();
              }, state.docs); // use arr as this
          var t2 = performance.now();
          Log.trace(CLASS_NAME+" [Reducer]",'updateTime  in '+(t2-t1)+' ms, with '+state.docs.length+' rows ' ); 
          return state;
      },

        
    }
});

 
export const {eventReceived,initialDataReceived,updateTime} = testSlice.actions

export default testSlice.reducer

export const ALL_SELECTOR = (state: { testStore: TestStoreState }) =>  state.testStore.docs

export const ODD_SELECTOR = (state: { testStore: TestStoreState }) => 
{
    
    var t1 = performance.now();    
    var filtered = state.testStore.docs.filter((testObject:any) => 
    {
        if(testObject.testState === "ODD")
        {
            return true;
        }
    });
    var t2 = performance.now();
    Log.trace(CLASS_NAME,'Selector Took '+(t2-t1)+' ms');
    return filtered;
}




// AppThunk sets the type definitions for the dispatch method
export const getDocs = (initialInquiryLoad:any): TestThunk => {
    Log.trace(CLASS_NAME,'getDocs Called');
    return async function myThunkFunction(dispatch:any,getState:any) {
        //const storeState = getState();
      
            try {
                socket.emit(SocketIOEvents.EVENT_REQUEST);
                Log.trace(CLASS_NAME,'Emitted the event '+SocketIOEvents.EVENT_REQUEST);
                //Inquiry Events
                socket.on(SocketIOEvents.EVENT_MESSAGES, (doc:any) => { 
                    
                    if(doc)    
                    {
                        doc.myNewAttribute = new Date().toISOString();
                        dispatch(eventReceived(doc));
                    } 
                    else
                    {
                        Log.error('Null or Invalid event received');
                    }
                });

                await socket.on(SocketIOEvents.EVENT_REPLY, (docs:Array<any>) => { 
                    Log.trace(CLASS_NAME,"Initial Data Received on "+SocketIOEvents.EVENT_REPLY);
                    if(docs && Array.isArray(docs))    
                    {
                        Log.trace(CLASS_NAME,'Number of Docs Received :' +docs.length);                    
                        docs.forEach(doc => {
                            doc.myNewAttribute = new Date().toISOString();
                        });
                        socket.off(SocketIOEvents.EVENT_REPLY);
                        dispatch(initialDataReceived(docs));
                    }

                    }); 
                    setInterval(() => {dispatch(updateTime())},5000);  
            } catch (error) {
                Log.error(CLASS_NAME,error);
            }
    }
   }


