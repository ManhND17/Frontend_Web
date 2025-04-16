import axios from "axios";

export const axiosJWT = axios.create();

export const createOrder = async (data,access_token) => {
    console.log('data',data,access_token)
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    })
    return res;
}

export const getOrderbyUserId = async (id,access_token) => {
const res = await axiosJWT.get(
  `${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`,
  {
    headers: {
      token: `Bearer ${access_token}`,
    },
    withCredentials: true,
  })
  return res;
}