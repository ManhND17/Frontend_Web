import axios from "axios";

export const axiosJWT = axios.create();


// export const getAllProducts = async () => {
//   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAlls`);
//   return res.data;
// };


export const createVoucher = async (data,access_token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/voucher/create`,
    data,{
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const getDetailVoucher = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/voucher/details/${id}`
  );
  return res.data;
};

export const updateVoucher = async (id, data,access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/voucher/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );

  return res.data;
};

export const deleteVoucher = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/voucher/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const checkVoucher = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/voucher/check/${id}`
  );
  return res.data;
};

export const getAllVoucher = async (access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/voucher/all-voucher`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};