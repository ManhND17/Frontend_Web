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

export const deleteOrder = async (id,access_token,data) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/delete/${id}`,
    {
      headers: {
        data,
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    })
    return res;
  }

  export const getAllOrder = async (limit,page,access_token) => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/order/get-all-order?limit=${limit}&page=${page}`,{
          headers: {
            token: `Bearer ${access_token}`,
          },
          withCredentials: true,
        }
      );
    return res.data;
  };

  export const updateOrderStatus = async (id,status,access_token) => {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/order/update-order-status/${id}`,
      {
        status
      }
    );
  return res.data;
};