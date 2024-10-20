import { configureStore } from '@reduxjs/toolkit';
import usersliceReducer from './slice1'; 

 const store = configureStore({
  reducer: {
    user: usersliceReducer, // Correct the key here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 