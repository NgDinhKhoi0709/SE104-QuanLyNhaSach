import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportForm from '../../components/forms/ImportForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock fetch for all API calls in ImportForm
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/suppliers')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([{ id: 1, name: 'Supplier 1' }]) });
    }
    if (url.includes('/api/books')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([{ id: 1, title: 'Book 1', stock: 10 }]) });
    }
    if (url.includes('/api/rules')) {
      // Sửa min_stock_before_import thành 0 để không chặn submit
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ min_import_quantity: 1, min_stock_before_import: 0, max_stock: 100, min_stock_after_sale: 1 }) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterAll(() => {
  global.fetch.mockRestore && global.fetch.mockRestore();
});

describe('ImportForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage for currentUser
    window.localStorage.setItem('user', JSON.stringify({ id: 1, full_name: 'Test User' }));
  });

  it('renders add import form correctly', async () => {
    render(<ImportForm {...defaultProps} />);
    expect(screen.getByText('Thêm phiếu nhập mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Nhà cung cấp')).toBeInTheDocument();
    expect(screen.getByText('Người nhập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm mới/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hủy bỏ/i })).toBeInTheDocument();
  });

  it('shows error if submit without supplier', async () => {
    render(<ImportForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(screen.getByText('Vui lòng chọn nhà cung cấp')).toBeInTheDocument();
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error if submit without any book', async () => {
    render(<ImportForm {...defaultProps} />);
    // Chọn nhà cung cấp giả lập
    fireEvent.change(screen.getByLabelText('Nhà cung cấp'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(screen.getByText('Vui lòng thêm ít nhất một sách')).toBeInTheDocument();
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows error if total is not positive', async () => {
    render(<ImportForm {...defaultProps} />);
    // Chọn nhà cung cấp
    fireEvent.change(screen.getByLabelText('Nhà cung cấp'), { target: { value: '1' } });
    // Thêm sách
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    // Chọn sách và nhập số lượng, giá = 0
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '1' } });
    fireEvent.change(screen.getAllByPlaceholderText('Số lượng')[0], { target: { value: '1' } });
    fireEvent.change(screen.getAllByPlaceholderText('Giá nhập')[0], { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(screen.getByText('Tổng tiền phải là số dương')).toBeInTheDocument();
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid data', async () => {
    render(<ImportForm {...defaultProps} />);
    // Chờ option nhà cung cấp xuất hiện
    await screen.findByText('Supplier 1');
    // Chọn nhà cung cấp
    const supplierSelect = screen.getByLabelText('Nhà cung cấp');
    fireEvent.change(supplierSelect, { target: { value: '1' } });
    fireEvent.blur(supplierSelect);
    await waitFor(() => {
      expect(supplierSelect.value).toBe('1');
    });
    // Thêm sách
    fireEvent.click(screen.getByRole('button', { name: /thêm sách/i }));
    // Chờ option sách xuất hiện
    await screen.findByText('Book 1');
    // Chọn sách và nhập số lượng, giá
    const bookSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(bookSelect, { target: { value: '1' } });
    fireEvent.blur(bookSelect);
    await waitFor(() => {
      expect(bookSelect.value).toBe('1');
    });
    const qtyInput = screen.getAllByPlaceholderText('Số lượng')[0];
    fireEvent.change(qtyInput, { target: { value: '2' } });
    fireEvent.blur(qtyInput);
    await waitFor(() => {
      expect(qtyInput.value).toBe('2');
    });
    const priceInput = screen.getAllByPlaceholderText('Giá nhập')[0];
    fireEvent.change(priceInput, { target: { value: '10000' } });
    fireEvent.blur(priceInput);
    await waitFor(() => {
      expect(priceInput.value).toBe('10000');
    });
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });
});
