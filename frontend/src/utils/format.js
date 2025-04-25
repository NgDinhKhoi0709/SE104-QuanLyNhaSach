export const formatCurrency = (value) => {
  if (!value) return '0 VNĐ';
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ`;
};

export const parseCurrency = (value) => {
  if (!value) return 0;
  return parseInt(value.replace(/[^\d]/g, ''));
}; 