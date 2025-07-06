import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupplierForm from '../../components/forms/SupplierForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName || icon}`} {...props} />
}));

describe('SupplierForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add supplier form correctly', () => {
    render(<SupplierForm {...defaultProps} />);
    expect(screen.getByText('Thêm nhà cung cấp mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên nhà cung cấp')).toBeInTheDocument();
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Địa chỉ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm mới/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hủy bỏ/i })).toBeInTheDocument();
  });

  it('renders edit supplier form correctly', () => {
    const supplier = { name: 'ABC', phone: '0123456789', email: 'abc@email.com', address: '123 Street' };
    render(<SupplierForm {...defaultProps} supplier={supplier} />);
    expect(screen.getByDisplayValue('ABC')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('abc@email.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Street')).toBeInTheDocument();
    expect(screen.getByText('Chỉnh sửa nhà cung cấp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cập nhật/i })).toBeInTheDocument();
  });

  it('shows error if submit with empty fields', async () => {
    render(<SupplierForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập tên nhà cung cấp')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập số điện thoại')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập email')).toBeInTheDocument();
      expect(screen.getByText('Vui lòng nhập địa chỉ')).toBeInTheDocument();
    });
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  

  it('calls onSubmit with valid data', async () => {
    render(<SupplierForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Tên nhà cung cấp'), { target: { value: 'Test Supplier' } });
    fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '0912345678' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText('Địa chỉ'), { target: { value: 'Test Address' } });
    fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: 'Test Supplier',
        phone: '0912345678',
        email: 'test@email.com',
        address: 'Test Address',
      });
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<SupplierForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hủy bỏ/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close icon is clicked', () => {
    render(<SupplierForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Đóng'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
