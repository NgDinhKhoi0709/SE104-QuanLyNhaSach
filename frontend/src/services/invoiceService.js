import axios from "axios";

const API_URL = "http://localhost:5000/api/invoices";

export const getAllInvoices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addInvoice = async (invoiceData) => {
  const response = await axios.post(API_URL, invoiceData);
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const deleteInvoice = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const exportInvoicePDF = async (id) => {
  // Sử dụng window.open để mở PDF trong tab mới
  window.open(`${API_URL}/${id}/pdf`, '_blank');
};
