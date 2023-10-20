import { createSlice } from '@reduxjs/toolkit';

export interface NavbarState {
  clicked: boolean;
}

const initialState: NavbarState = {
  clicked: false,
};

export const navbarSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    clickMenuButton: (state, { payload }) => {
      state.clicked = payload;
    },
  },
});

export const { clickMenuButton } = navbarSlice.actions;

export default navbarSlice.reducer;
