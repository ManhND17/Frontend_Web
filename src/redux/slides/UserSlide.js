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
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      // Giữ nguyên các giá trị hiện tại nếu payload không cung cấp
      const { 
        name = state.name, 
        email = state.email,
        _id = state.id,
        phone = state.phone,
        address = state.address,
        avatar = state.avatar,
        access_token = state.access_token,
        isAdmin = state.isAdmin,
        city = state.city
      } = action.payload;
      
      // Cập nhật state
      state.name = name;
      state.email = email;
      state.id = _id; // Sử dụng cả _id và id để tương thích
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
    },
    resetUser: (state) => {
      // Giữ nguyên isLoading nếu cần
      return { ...initialState, isLoading: state.isLoading };
    },
    logout: () => {
      return initialState;
    }
  }
})

// Action creators
export const { updateUser, resetUser, logout } = userSlide.actions;

export default userSlide.reducer;