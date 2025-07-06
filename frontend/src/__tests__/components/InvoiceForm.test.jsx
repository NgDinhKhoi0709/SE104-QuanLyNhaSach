import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InvoiceForm from '../../components/forms/InvoiceForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName || icon}`} {...props} />
}));

// Mock các service
jest.mock('../../services/bookService', () => ({
  getAllBooks: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Book 1', stock: 10, price: 10000 },
    { id: 2, title: 'Book 2', stock: 5, price: 20000 },
  ])),
}));
jest.mock('../../services/promotionService', () => ({
  checkPromotion: jest.fn((code, total) => {
    if (code === 'PROMO10') {
      return Promise.resolve({ success: true, message: 'Áp dụng thành công', data: { discountAmount: 1000, finalAmount: total - 1000 } });
    }
    return Promise.reject({ response: { data: { message: 'Mã không hợp lệ' } } });
  })
}));

describe('InvoiceForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(async (data) => ({ id: 123 })),
    onClose: jest.fn(),
    setShowForm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.open = jest.fn();
    window.localStorage.setItem('user', JSON.stringify({ id: 1, full_name: 'Test User' }));
  });

  it('renders add invoice form correctly', async () => {
    render(<InvoiceForm {...defaultProps} />);
    expect(screen.getByText('Thêm hóa đơn mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên khách hàng')).toBeInTheDocument();
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument();
    expect(screen.getByLabelText('Người lập')).toBeInTheDocument();
    expect(screen.getByLabelText('Ngày lập hóa đơn')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm mới/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hủy bỏ/i })).toBeInTheDocument();
    // Đợi nút "Thêm sách" xuất hiện (dấu hiệu đã load xong giao diện sách)
    await screen.findByRole('button', { name: /thêm sách/i });
  });

  it('shows error if submit without customer info', async () => {
    render(<InvoiceForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập tên khách hàng')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập số điện thoại')).toBeInTheDocument();
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('can add and remove book rows', async () => {
    render(<InvoiceForm {...defaultProps} />);
    await screen.findByRole('button', { name: /thêm sách/i });
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    expect(screen.getAllByRole('combobox').length).toBeGreaterThan(0);
    // Tìm nút xóa bằng icon hoặc text
    const removeBtns = screen.getAllByRole('button').filter(btn => btn.innerHTML.includes('trash') || btn.textContent.toLowerCase().includes('xóa'));
    if (removeBtns.length > 0) fireEvent.click(removeBtns[0]);
    // Sau khi xóa hết thì không còn input số lượng
    // Có thể kiểm tra lại số dòng trong tbody
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody.children.length).toBe(0);
  });

  it('shows stock error if quantity exceeds stock', async () => {
    render(<InvoiceForm {...defaultProps} />);
    await screen.findByRole('button', { name: /thêm sách/i });
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '20' } });
    await waitFor(() => {
      expect(screen.getByText('Số lượng tồn không đủ')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /thêm mới/i })).toBeDisabled();
  });

  it('applies promotion code successfully', async () => {
    render(<InvoiceForm {...defaultProps} />);
    await screen.findByRole('button', { name: /thêm sách/i });
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Nhập mã'), { target: { value: 'PROMO10' } });
    fireEvent.click(screen.getByRole('button', { name: /áp dụng/i }));
    await waitFor(() => {
      expect(screen.getByText('Áp dụng thành công')).toBeInTheDocument();
    });
  });

  it('shows error for invalid promotion code', async () => {
    render(<InvoiceForm {...defaultProps} />);
    await screen.findByRole('button', { name: /thêm sách/i });
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Nhập mã'), { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByRole('button', { name: /áp dụng/i }));
    await waitFor(() => {
      expect(screen.getByText('Mã không hợp lệ')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with valid data and opens PDF', async () => {
    render(<InvoiceForm {...defaultProps} />);
    await screen.findByRole('button', { name: /thêm sách/i });
    fireEvent.change(screen.getByLabelText('Tên khách hàng'), { target: { value: 'Khách A' } });
    fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '0912345678' } });
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('/api/invoices/123/pdf'), '_blank');
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<InvoiceForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hủy bỏ/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
