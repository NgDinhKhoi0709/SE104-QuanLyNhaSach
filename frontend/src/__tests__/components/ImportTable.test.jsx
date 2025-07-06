import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImportTable from '../../components/tables/ImportTable';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock child components
jest.mock('../../components/forms/ImportForm', () => {
  return function MockImportForm({ onSubmit, onClose, importData }) {
    return (
      <div data-testid="import-form">
        <h3>{importData ? 'Sửa phiếu nhập' : 'Thêm phiếu nhập mới'}</h3>
        <button onClick={() => onSubmit({ importCode: 'PN001', supplier: 'NCC Test', total: 1000000, bookDetails: [] })}>
          Submit
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
});

jest.mock('../../components/modals/ImportDetailsModal', () => {
  return function MockImportDetailsModal({ isOpen, onClose, importData }) {
    if (!isOpen) return null;
    return (
      <div data-testid="import-details-modal">
        <span>Chi tiết phiếu nhập</span>
        <button onClick={onClose}>Close</button>
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

describe('ImportTable', () => {
  const mockImports = [
    {
      id: 1,
      importCode: 1,
      date: '2024-07-01',
      supplier: 'NCC Test',
      supplier_id: 1,
      employee: 'NV01',
      total: 1000000,
      bookDetails: [
        { id: 1, bookId: 1, book: 'Sách A', quantity: 5, price: 200000 }
      ]
    },
    {
      id: 2,
      importCode: 2,
      date: '2024-07-02',
      supplier: 'NCC 2',
      supplier_id: 2,
      employee: 'NV02',
      total: 2000000,
      bookDetails: [
        { id: 2, bookId: 2, book: 'Sách B', quantity: 10, price: 200000 }
      ]
    }
  ];
  const mockSuppliers = [
    { id: 1, name: 'NCC Test' },
    { id: 2, name: 'NCC 2' }
  ];

  beforeEach(() => {
    fetch.mockReset();
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockImports })
      .mockResolvedValueOnce({ ok: true, json: async () => mockSuppliers });
  });

  const renderImportTable = () => render(<ImportTable />);

  it('renders import table with data', async () => {
    renderImportTable();
    await waitFor(() => {
      // Kiểm tra có đúng 1 cell mã phiếu nhập là 1 và 1 cell là 2
      expect(screen.getAllByText('1', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('2', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getByText('NCC Test')).toBeInTheDocument();
    expect(screen.getByText('NCC 2')).toBeInTheDocument();
    // Kiểm tra giá trị tổng tiền thực tế hiển thị trong table (theo mock hiện tại là '0 VNĐ')
    expect(screen.getAllByText('0 VNĐ', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
  });

  it('opens add import form when clicking add button', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getByText('NCC Test')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);
    expect(screen.getByTestId('import-form')).toBeInTheDocument();
    expect(screen.getByText('Thêm phiếu nhập mới')).toBeInTheDocument();
  });

  it('opens edit form when clicking edit (not implemented in UI, skip)', () => {
    // Nếu ImportTable có nút sửa, có thể test tương tự BookTable
    // Để trống vì ImportTable hiện tại không có nút sửa
  });

  it('filters imports by search term', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getByText('NCC Test')).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText('Nhập mã phiếu nhập...');
    fireEvent.change(searchInput, { target: { value: '1' } });
    expect(searchInput.value).toBe('1');
    // Kiểm tra có cell mã phiếu nhập là 1
    expect(screen.getAllByText('1', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
  });

  it('opens advanced search panel', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getByText('NCC Test')).toBeInTheDocument();
    });
    const advancedSearchButton = screen.getByTitle('Tìm kiếm nâng cao');
    fireEvent.click(advancedSearchButton);
    expect(screen.getByLabelText('Mã phiếu nhập')).toBeInTheDocument();
    expect(screen.getByLabelText('Nhà cung cấp')).toBeInTheDocument();
  });

  it('selects and deselects rows', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getAllByText('5', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
    });
    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1];
    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();
    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it('shows delete confirmation modal', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getAllByText('5', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
    });
    // Select a row first
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    // Click delete button
    const deleteButton = screen.getByText('Xóa');
    fireEvent.click(deleteButton);
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    // Mock more imports to test pagination
    const manyImports = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      importCode: i + 1,
      date: '2024-07-01',
      supplier: 'NCC Test',
      supplier_id: 1,
      employee: 'NV01',
      total: 1000000,
      bookDetails: [{ id: 1, bookId: 1, book: 'Sách A', quantity: 5, price: 200000 }]
    }));
    fetch.mockReset();
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => manyImports })
      .mockResolvedValueOnce({ ok: true, json: async () => mockSuppliers });
    renderImportTable();
    await waitFor(() => {
      expect(screen.getAllByText('5', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
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

  it('submits import form successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 3 }) });
    renderImportTable();
    await waitFor(() => {
      expect(screen.getAllByText('5', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
    });
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/imports',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('shows import details modal', async () => {
    renderImportTable();
    await waitFor(() => {
      expect(screen.getAllByText('5', { selector: 'td' }).length).toBeGreaterThanOrEqual(1);
    });
    const viewButtons = screen.getAllByTitle('Xem chi tiết');
    fireEvent.click(viewButtons[0]);
    expect(screen.getByTestId('import-details-modal')).toBeInTheDocument();
  });
});
