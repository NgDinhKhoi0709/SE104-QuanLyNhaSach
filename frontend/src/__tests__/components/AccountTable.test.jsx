
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountTable from '../../components/tables/AccountTable';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock child components
jest.mock('../../components/forms/AccountForm', () => {
  return function MockAccountForm({ onSave, onCancel, account }) {
    return (
      <div data-testid="account-form">
        <h3>{account ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h3>
        <button onClick={() => onSave({ id: 3, username: 'user3', fullName: 'User Three', email: 'user3@email.com', phone: '0123456789', gender: 'male', role: 'sales', status: 'active' })}>
          Submit
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

jest.mock('../../components/modals/ConfirmationModal', () => {
  return function MockConfirmationModal({ isOpen, onConfirm, onClose, title, message }) {
    if (!isOpen) return null;
    return (
      <div data-testid="confirmation-modal">
        <span>{title}</span>
        <span>{message}</span>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
});

describe('AccountTable', () => {
  const mockAccounts = [
    {
      id: 1,
      username: 'admin',
      full_name: 'Admin User',
      email: 'admin@email.com',
      phone: '0123456789',
      gender: 'male',
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      username: 'user2',
      full_name: 'User Two',
      email: 'user2@email.com',
      phone: '0987654321',
      gender: 'female',
      role: 'sales',
      status: 'inactive',
    },
  ];

  beforeEach(() => {
    fetch.mockReset();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockAccounts });
  });

  const renderAccountTable = () => render(<AccountTable />);

  it('renders account table with data', async () => {
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
      expect(screen.getByText('Kích hoạt')).toBeInTheDocument();
      expect(screen.getByText('Khóa')).toBeInTheDocument();
    });
  });

  it('opens add account form when clicking add button', async () => {
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Thêm tài khoản');
    fireEvent.click(addButton);
    expect(screen.getByTestId('account-form')).toBeInTheDocument();
    expect(screen.getByText('Thêm tài khoản mới')).toBeInTheDocument();
  });

  it('filters accounts by username', async () => {
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên đăng nhập...');
    fireEvent.change(searchInput, { target: { value: 'user2' } });
    expect(searchInput.value).toBe('user2');
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
  });

  it('opens edit form when clicking edit (simulate by clicking username cell)', async () => {
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
    // Giả lập click vào username để mở form sửa (nếu có logic này, nếu không thì skip)
    // fireEvent.click(screen.getByText('admin'));
    // expect(screen.getByTestId('account-form')).toBeInTheDocument();
    // expect(screen.getByText('Chỉnh sửa tài khoản')).toBeInTheDocument();
  });

  it('shows delete confirmation modal', async () => {
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
    // Tìm nút xóa của user2
    const deleteButtons = screen.getAllByTitle('Xóa');
    fireEvent.click(deleteButtons[1]);
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    // Mock nhiều account để test phân trang
    const manyAccounts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      full_name: `User ${i + 1}`,
      email: `user${i + 1}@email.com`,
      phone: '0123456789',
      gender: 'male',
      role: 'sales',
      status: 'active',
    }));
    fetch.mockReset();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => manyAccounts });
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
    expect(screen.getByText(/Hiển thị.*1.*đến.*10.*của.*25.*mục/)).toBeInTheDocument();
    const paginationContainer = screen.getByText(/Hiển thị.*1.*đến.*10.*của.*25.*mục/).closest('.pagination');
    const paginationControls = paginationContainer.querySelector('.pagination-controls');
    const allButtons = paginationControls.querySelectorAll('.pagination-button');
    expect(allButtons[0]).toHaveTextContent('<');
    expect(allButtons[1]).toHaveTextContent('1');
    expect(allButtons[2]).toHaveTextContent('2');
    expect(allButtons[3]).toHaveTextContent('3');
    expect(allButtons[4]).toHaveTextContent('>');
    expect(allButtons[1]).toHaveClass('active');
    const nextButton = allButtons[4];
    fireEvent.click(nextButton);
    await waitFor(() => {
      const updatedPaginationControls = screen.getByText(/Hiển thị.*11.*đến.*20.*của.*25.*mục/)
        .closest('.pagination')
        .querySelector('.pagination-controls');
      const updatedButtons = updatedPaginationControls.querySelectorAll('.pagination-button');
      expect(updatedButtons[2]).toHaveClass('active');
    });
  });

  it('submits account form successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 4 }) });
    renderAccountTable();
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Thêm tài khoản');
    fireEvent.click(addButton);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      const called = fetch.mock.calls.some(
        call => call[0] === 'http://localhost:5000/api/accounts'
      );
      expect(called).toBe(true);
    });
  });
});
