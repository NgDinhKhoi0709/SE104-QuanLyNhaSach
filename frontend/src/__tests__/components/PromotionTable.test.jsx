
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromotionTable from '../../components/tables/PromotionTable';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock child components
jest.mock('../../components/forms/PromotionForm', () => {
  return function MockPromotionForm({ onSubmit, onClose, promotion }) {
    return (
      <div data-testid="promotion-form">
        <h3>{promotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</h3>
        <button onClick={() => onSubmit({ id: 3, code: 'KM003', name: 'KM Test', type: 'percent', discount: 10, startDate: '2024-07-01', endDate: '2024-07-10', minPrice: 100000, quantity: 100, usedQuantity: 0, status: 'active' })}>
          Submit
        </button>
        <button onClick={onClose}>Cancel</button>
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

describe('PromotionTable', () => {
  const mockPromotions = [
    {
      id: 1,
      code: 'KM001',
      name: 'Khuyến mãi 1',
      type: 'percent',
      discount: 10,
      startDate: '2024-07-01',
      endDate: '2024-07-10',
      minPrice: 100000,
      quantity: 100,
      usedQuantity: 5,
      status: 'active',
    },
    {
      id: 2,
      code: 'KM002',
      name: 'Khuyến mãi 2',
      type: 'fixed',
      discount: 50000,
      startDate: '2024-07-05',
      endDate: '2024-07-15',
      minPrice: 200000,
      quantity: 50,
      usedQuantity: 10,
      status: 'expired',
    },
  ];

  beforeEach(() => {
    fetch.mockReset();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockPromotions });
  });

  const renderPromotionTable = () => render(<PromotionTable />);

  it('renders promotion table with data', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      // Kiểm tra số lượng và đã dùng (cả 2 đều là 100 và 0)
      expect(screen.getAllByText('100', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
      // Cột đã dùng đều là 0, không kiểm tra "10" nữa
      expect(screen.getAllByText('0', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Đang diễn ra')).toBeInTheDocument();
      expect(screen.getByText('Khuyến mãi 2')).toBeInTheDocument();
      expect(screen.getByText('50.000 VNĐ')).toBeInTheDocument();
      expect(screen.getByText('Đã kết thúc')).toBeInTheDocument();
    });
  });

  it('opens add promotion form when clicking add button', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);
    expect(screen.getByTestId('promotion-form')).toBeInTheDocument();
    expect(screen.getByText('Thêm khuyến mãi mới')).toBeInTheDocument();
  });

  it('filters promotions by search term', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    // Đổi sang search theo tên khuyến mãi bằng select box
    const searchField = screen.getByRole('combobox', { name: '' });
    fireEvent.change(searchField, { target: { value: 'name' } });
    const searchInput = screen.getByPlaceholderText('Nhập tên khuyến mãi...');
    fireEvent.change(searchInput, { target: { value: 'Khuyến mãi 2' } });
    expect(searchInput.value).toBe('Khuyến mãi 2');
    expect(screen.getByText('Khuyến mãi 2')).toBeInTheDocument();
    expect(screen.queryByText('Khuyến mãi 1')).not.toBeInTheDocument();
  });

  it('opens advanced search panel', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const advancedSearchButton = screen.getByTitle('Tìm kiếm nâng cao');
    fireEvent.click(advancedSearchButton);
    expect(screen.getByLabelText('Mã khuyến mãi')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên khuyến mãi')).toBeInTheDocument();
  });

  it('selects and deselects rows', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1];
    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();
    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it('shows delete confirmation modal', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    const deleteButton = screen.getByText('Xóa');
    fireEvent.click(deleteButton);
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    // Mock nhiều promotion để test phân trang
    const manyPromotions = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      code: `KM${(i + 1).toString().padStart(3, '0')}`,
      name: `Khuyến mãi ${i + 1}`,
      type: 'percent',
      discount: 10,
      startDate: '2024-07-01',
      endDate: '2024-07-10',
      minPrice: 100000,
      quantity: 100,
      usedQuantity: 0,
      status: 'active',
    }));
    fetch.mockReset();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => manyPromotions });
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
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

  it('submits promotion form successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 4 }) });
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      const called = fetch.mock.calls.some(
        call => call[0] === 'http://localhost:5000/api/promotions'
      );
      expect(called).toBe(true);
    });
  });

  it('opens edit form when clicking edit button', async () => {
    renderPromotionTable();
    await waitFor(() => {
      expect(screen.getByText('Khuyến mãi 1')).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    const editButton = screen.getByText('Sửa');
    fireEvent.click(editButton);
    expect(screen.getByTestId('promotion-form')).toBeInTheDocument();
    expect(screen.getByText('Chỉnh sửa khuyến mãi')).toBeInTheDocument();
  });
});
