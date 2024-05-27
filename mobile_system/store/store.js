import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../features/DataSlice';

export const store = configureStore({
    reducer: {
        data: dataReducer,
    }
});
