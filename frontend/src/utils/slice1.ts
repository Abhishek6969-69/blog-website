import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface User {
  email: string;
  name: string;
}

interface UserState {
  users: User[];
  loggedIn: boolean; // Add loggedIn state
}

const initialState: UserState = {
  users: [],
  loggedIn: false, // Default to false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload); // Append user instead of replacing
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload; // Set loggedIn state
    },
  },
});

export const { addUser, setLoggedIn } = userSlice.actions;

// Selector to get users
export const selectUsers = (state: RootState) => state.user.users;
// Selector to check if user is logged in
export const selectLoggedIn = (state: RootState) => state.user.loggedIn;

export default userSlice.reducer;
