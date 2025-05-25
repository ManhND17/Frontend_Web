import axios from "axios";

export const axiosJWT = axios.create();

export const createOrder = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getRevenueByMonth = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/revenue-by-month`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const TopSelling = async (month, year,limit, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/top-selling-by-month?year=${year}&month=${month}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const TopCustomer = async (month, year,limit, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/top-custormer-by-month?year=${year}&month=${month}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getOrderByDate = async (date, page,limit, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-date?date=${date}&page=${page}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getOrderByDateRange = async (startDate, endDate, page,limit, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getOrderByStatus = async (status, page,limit, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-status?status=${status}&page=${page}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getOrderCountStatus = async ( access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-count-group-by-status`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getSummaryStat = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-summary-stat`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};
export const getOrderbyUserId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};
export const getOrderbyOrderId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const deleteOrder = async (id, access_token, data) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/delete/${id}`,
    {
      headers: {
        data,
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res;
};

export const getAllOrder = async (limit, page, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order?limit=${limit}&page=${page}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const updateOrderStatus = async (id, status, access_token) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/order/update-order-status/${id}`,
    {
      status,
    }
  );
  return res.data;
};

export const crecreateVNPayPaymentUrl = async (data) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/vnpay/create-payment`,
    data
  );
};
