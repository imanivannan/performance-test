import { configureStore } from '@reduxjs/toolkit';
import testReducer from '../features/test/TestSlice';


const store = configureStore({
    reducer: {
      testStore: testReducer,
    },
      
  });
  
  export default store
