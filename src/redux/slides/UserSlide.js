import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  id: '',
  access_token: '',
  isAdmin: false,
  isLoading: false,
  city: '',
  refreshToken:'',
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { 
        name = state.name, 
        email = state.email,
        _id = state.id,
        phone = state.phone,
        address = state.address,
        avatar = state.avatar,
        access_token = state.access_token,
        isAdmin = state.isAdmin,
        city = state.city,
        refreshToken = state.refreshToken
      } = action.payload;
      
      // Cập nhật state
      state.name = name;
      state.email = email;
      state.id = _id; 
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refreshToken = refreshToken
    },
    resetUser: (state) => {
      return { ...initialState, isLoading: state.isLoading };
    },
    logout: () => {
      return initialState;
    }
  }
})

export const { updateUser, resetUser, logout } = userSlide.actions;

export default userSlide.reducer;