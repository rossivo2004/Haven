import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'; // Add this import

// Define the User type
interface User {
    email: string;
    name: string;
    password: string; // Consider hashing passwords instead of storing them directly
}

interface UserState {
    user: User | null; // Use the User type here
    userId: number | null; // Add userId to the state
}

const initialState: UserState = {
    user: null,
    userId: null, // Initialize userId
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            const expirationTime = Math.floor(Date.now() / 1000) + (10 * 60); // 10 minutes from now

            Cookies.set('user', JSON.stringify(action.payload), { expires: 10 / (24 * 60) }); // Save user data to cookies for 10 minutes
            Cookies.set('cookieExpiration', expirationTime.toString()); // Set cookie expiration time
        },
        setUserId(state, action: PayloadAction<number>) { // Add setUserId reducer
            state.userId = action.payload; // Store userId in state
            Cookies.set('user_id', String(action.payload), { expires: 7 }); // Save user_id to cookies for 7 days
        },
        clearUser(state) {
            state.user = null;
            state.userId = null; // Clear userId

            Cookies.remove('user'); // Remove user data from cookies
            Cookies.remove('user_id'); // Remove user_id from cookies
            Cookies.remove('cookieExpiration'); // Remove cookieExpiration
        },
        logout(state) { // New logout action
            state.user = null;
            state.userId = null; // Clear userId
            Cookies.remove('user'); // Remove user data from cookies
            Cookies.remove('user_id'); // Remove user_id from cookies
            Cookies.remove('cookieExpiration'); // Remove cookieExpiration
        },
    },
});

export const { setUser, clearUser, setUserId, logout } = userSlice.actions; // Export logout action
export default userSlice.reducer;