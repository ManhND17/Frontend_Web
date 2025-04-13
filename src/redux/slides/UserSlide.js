import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email:'',
  phone:'',
  address:'',
  avatar:'',
  id:'',
  access_token:'',
  isAdmin:false,
  isLoading:false,
  city: '',
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state,action) =>{
        const {name,email,_id,phone='',address='',avatar='',access_token,isAdmin='false',city=''} = action.payload
        state.name = name;
        state.phone = phone
        state.address = address
        state.id = _id
        state.avatar = avatar
        state.email = email
        state.access_token = access_token
        state.isAdmin = isAdmin
        state.city = city
    },
    logout: () =>{
      return initialState
    }
  }
})

// Action creators are generated for each case reducer function
export const { updateUser, logout} = userSlide.actions

export default userSlide.reducer