import axios from "axios";

export const axiosJWT = axios.create();


export const createReview = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/review/create`,
    data
  );
  return res.data;
};


export const updateReview = async (id, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/review/update/${id}`,
    data
  );

  return res.data;
};



export const deleteReview = async (id) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/review/delete/${id}`
  );
  return res.data;
};

export const getReview = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/review/get-details-comment-product/${id}`
  );
  return res.data;
};

export const getDetailsReview = async (order,product) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/review/details/${product}/${order}`
    );
    return res.data;
};