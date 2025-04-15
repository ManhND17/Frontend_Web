import { createSlice } from "@reduxjs/toolkit";


const initialState =JSON.parse(localStorage.getItem('order')) || {
  orderItems: [
    ],
  orderItemSlected:[],
  shippingAddress: {
    },
  
  paymentMethod: '',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  user: '',
  isPaid: false,
  paidAt: '',
  isDelivered: false,
  deliveredAt: '',
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
        const {orderItem} = action.payload
        
        const itemOrder = state?.orderItems?.find((item)=> item?.product === orderItem.product)
        if(itemOrder){
            itemOrder.amount += orderItem?.amount
        }else{
            state.orderItems.push(orderItem)
        }
        console.log('ttt',state.orderItems)
      },
      increaseAmount: (state, action) => {
        const idProduct  = action.payload;
        const itemOrder = state.orderItems?.find((item) => item.product === idProduct);
        const itemOrderSelected = state.orderItemSlected?.find((item) => item.product === idProduct);
        if (itemOrder) {
          itemOrder.amount++;
          if (itemOrderSelected) { 
            itemOrderSelected.amount++;
          }
        }
      },
      decreaseAmount: (state, action) => {
        const idProduct  = action.payload;
        const itemOrder = state?.orderItems?.find((item) => item.product === idProduct);
        const itemOrderSelected = state?.orderItemSlected?.find((item) => item.product === idProduct);
        if (itemOrder && itemOrder.amount > 1) {
          itemOrder.amount--;
          if (itemOrderSelected) { 
            itemOrderSelected.amount--;
          }
        }
      },
      
      removeOrderProduct: (state, action) => {
        const idProduct = action.payload;
        state.orderItems = state.orderItems.filter((item) => item?.product !== idProduct);
        state.orderItemSlected = state.orderItemSlected.filter((item) => item?.product !== idProduct);
      },
      selectedOrder: (state,action) =>{
        const {listChecked} = action.payload
        const orderSelect = []
        state.orderItems.forEach((order)=>{
          if(listChecked.includes(order.product)){
            orderSelect.push(order)
          }
        })
        state.orderItemSlected = orderSelect
      }
  },
});

// Action creators are generated for each case reducer function
export const { addOrderProduct,removeOrderProduct,increaseAmount,decreaseAmount,selectedOrder} = orderSlice.actions;

export default orderSlice.reducer;