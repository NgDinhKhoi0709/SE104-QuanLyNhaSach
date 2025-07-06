import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountForm from '../../components/forms/AccountForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

describe('AccountForm', () => {
  const defaultProps = {
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add account form correctly', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Tên đăng nhập')).toBeInTheDocument();
    expect(screen.getByLabelText('Họ và tên')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument();
    // Check gender radio group by label text for one of the options
    expect(screen.getByLabelText('Nam')).toBeInTheDocument();
    expect(screen.getByLabelText('Nữ')).toBeInTheDocument();
    // Check role select by label text
    expect(screen.getByLabelText('Vai trò')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tạo tài khoản/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hủy bỏ/i })).toBeInTheDocument();
  });

  it('renders edit account form with existing data', async () => {
    const existingAccount = {
      id: 1,
      username: 'user1',
      fullName: 'User One',
      email: 'user1@email.com',
      phone: '0123456789',
      gender: 'male',
      role: 'sales',
    };
    render(<AccountForm {...defaultProps} account={existingAccount} />);
    await waitFor(() => {
      expect(screen.getByText('Chỉnh sửa tài khoản')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('user1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User One')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user1@email.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0123456789')).toBeInTheDocument();
    // Check that the correct role is selected
    const roleSelect = screen.getByLabelText('Vai trò');
    expect(roleSelect.value).toBe('sales');
    expect(screen.getByRole('button', { name: /cập nhật/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    const submitButton = screen.getByRole('button', { name: /tạo tài khoản/i });
    fireEvent.click(submitButton);
    expect(defaultProps.onSave).not.toHaveBeenCalled();
    // Chờ các thông báo lỗi xuất hiện
    await waitFor(() => {
      expect(screen.queryByText('Tên đăng nhập là bắt buộc', { exact: false })).not.toBeNull();
      expect(screen.queryByText('Họ và tên là bắt buộc', { exact: false })).not.toBeNull();
      expect(screen.queryByText('Email là bắt buộc', { exact: false })).not.toBeNull();
      expect(screen.queryByText('Số điện thoại là bắt buộc', { exact: false })).not.toBeNull();
      expect(screen.queryByText('Giới tính là bắt buộc', { exact: false })).not.toBeNull();
      // Không kiểm tra lỗi "Vai trò là bắt buộc" vì mặc định luôn có giá trị "sales"
    });
  });

  it('validates email and phone format', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    const emailInput = screen.getByLabelText('Email');
    const phoneInput = screen.getByLabelText('Số điện thoại');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    fireEvent.change(phoneInput, { target: { value: 'abc' } });
    fireEvent.blur(phoneInput);
    const submitButton = screen.getByRole('button', { name: /tạo tài khoản/i });
    fireEvent.click(submitButton);
    expect(defaultProps.onSave).not.toHaveBeenCalled();
    // Chờ các thông báo lỗi xuất hiện
    await waitFor(() => {
      expect(screen.queryByText('Email không hợp lệ', { exact: false })).not.toBeNull();
      expect(screen.queryByText('Số điện thoại phải có 10-11 chữ số', { exact: false })).not.toBeNull();
    });
  });

  it('submits form with valid data', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText('Tên đăng nhập'), { target: { value: 'user2' } });
    fireEvent.change(screen.getByLabelText('Họ và tên'), { target: { value: 'User Two' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user2@email.com' } });
    fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByLabelText('Nam'));
    fireEvent.change(screen.getByLabelText('Vai trò'), { target: { value: 'sales' } });
    const submitButton = screen.getByRole('button', { name: /tạo tài khoản/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(expect.objectContaining({
        username: 'user2',
        fullName: 'User Two',
        email: 'user2@email.com',
        phone: '0123456789',
        gender: 'male',
        role: 'sales',
      }));
    });
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    const cancelButton = screen.getByRole('button', { name: /hủy bỏ/i });
    fireEvent.click(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when close button is clicked', async () => {
    render(<AccountForm {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
    });
    const closeButton = screen.getByLabelText('Đóng');
    fireEvent.click(closeButton);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
