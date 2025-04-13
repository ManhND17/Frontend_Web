import axios from "axios";

export const axiosJWT = axios.create();

export const getAllProductHome = async (search, limit) => {
  let res = {};
  if (search && limit) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}`
    );
  } else if (limit) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}`
    );
  }
  return res.data;
};

export const getAllProducts = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAlls`);
  return res.data;
};

export const getAllProduct = async (search, page, limit) => {
  let res = {};
  if (search && limit) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}`
    );
  } else if (limit && page) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}&page=${page}`
    );
  } else if (limit) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}`
    );
  }
  return res.data;
};

export const getProductType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};

export const getDetailProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
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

export const deleteProduct = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-type`
  );
  return res.data;
};
