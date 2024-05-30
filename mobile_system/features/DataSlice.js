import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
    name: 'data',
    initialState: [],
    reducers: {
        move: ((state, action) => {
            state.push(action.payload);
        })
    }
});

export const { move } = dataSlice.actions;
export default dataSlice.reducer;