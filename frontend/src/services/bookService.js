import axios from "axios";

const API_URL = "http://localhost:5000/api/books";

export const getAllBooks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getOldStockBooks = async (months = 2) => {
  const response = await axios.get(`${API_URL}/old-stock`, {
    params: { months },
  });
  return response.data;
};
