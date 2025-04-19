import axios from "axios";

export const axiosJWT = axios.create();

export const createCart = async (id) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/cart/create/${id}`
  );
  return res;
};

export const getCartbyUserId = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/cart/details/${id}`
  );
  return res;
};

export const deleteCart = async (user,product) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/cart/delete-product-from-cart`,
    {
      data: {
        userId: user,
        productId: product,
      },
    }
  );
  return res;
};

export const updateCartAmount = async (user,product,amount) => {
  console.log('checkService',user,product,amount)
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/cart/update-product-amount`,
    {
      data:{
      userId: user,
      productId: product,
      amount: amount,
      }
    }
  );
  return res.data;
};

export const addCart = async ({user, product, amount}) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/cart/add-to-cart`,
    {
      userId: user,
      productId: product,
      amount: amount,
    }
  );
  return res.data;
};
