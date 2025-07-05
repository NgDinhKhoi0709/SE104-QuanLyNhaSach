import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookTable from '../../components/tables/BookTable';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock child components
jest.mock('../../components/forms/BookForm', () => {
  return function MockBookForm({ onSubmit, onCancel, book }) {
    return (
      <div data-testid="book-form">
        <h3>{book ? 'Sửa sách' : 'Thêm sách mới'}</h3>
        <button onClick={() => onSubmit({ title: 'Test Book', author: 'Test Author' })}>
          Submit
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

jest.mock('../../components/modals/ConfirmationModal', () => {
  return function MockConfirmationModal({ isOpen, onConfirm, onCancel, children }) {
    if (!isOpen) return null;
    return (
      <div data-testid="confirmation-modal">
        {children}
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

// Mock utils
jest.mock('../../utils/format', () => ({
  formatCurrency: (amount) => `${amount.toLocaleString()} VNĐ`
}));

describe('BookTable', () => {
  const mockBooks = [
    {
      id: 1,
      title: 'Sách Test 1',
      author: 'Tác giả 1',
      category_name: 'Khoa học',
      publisher_name: 'NXB Test',
      price: 100000,
      quantity: 10,
      sold_quantity: 5
    },
    {
      id: 2,
      title: 'Sách Test 2',
      author: 'Tác giả 2',
      category_name: 'Văn học',
      publisher_name: 'NXB Test 2',
      price: 150000,
      quantity: 8,
      sold_quantity: 3
    }
  ];

  const mockCategories = [
    { id: 1, name: 'Khoa học' },
    { id: 2, name: 'Văn học' }
  ];

  const mockPublishers = [
    { id: 1, name: 'NXB Test' },
    { id: 2, name: 'NXB Test 2' }
  ];

  beforeEach(() => {
    // Mock fetch responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooks
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPublishers
      });
  });

  const renderBookTable = (props = {}) => {
    const defaultProps = {
      onEdit: jest.fn(),
      onDelete: jest.fn(),
      onView: jest.fn()
    };
    return render(<BookTable {...defaultProps} {...props} />);
  };

  it('renders book table with data', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
      expect(screen.getByText('Sách Test 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Tác giả 1')).toBeInTheDocument();
    expect(screen.getByText('100,000 VNĐ')).toBeInTheDocument();
  });

  it('opens add book form when clicking add button', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);

    expect(screen.getByTestId('book-form')).toBeInTheDocument();
    expect(screen.getByText('Thêm sách mới')).toBeInTheDocument();
  });

  it('opens edit form when clicking edit button', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    // Select a row first
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Click the edit button in the toolbar
    const editButton = screen.getByText('Sửa').closest('button');
    fireEvent.click(editButton);

    expect(screen.getByTestId('book-form')).toBeInTheDocument();
    expect(screen.getByText('Sửa sách')).toBeInTheDocument();
  });

  it('filters books by search term', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
      expect(screen.getByText('Sách Test 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Nhập tên sách...');
    fireEvent.change(searchInput, { target: { value: 'Sách Test 1' } });

    // Test search functionality
    expect(searchInput.value).toBe('Sách Test 1');
  });

  it('opens advanced search panel', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    const advancedSearchButton = screen.getByTitle('Tìm kiếm nâng cao');
    fireEvent.click(advancedSearchButton);

    // Look for specific labels in the advanced search panel
    expect(screen.getByLabelText('Tác giả')).toBeInTheDocument();
    expect(screen.getByLabelText('Thể loại')).toBeInTheDocument();
  });

  it('selects and deselects rows', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip the "select all" checkbox

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it('shows delete confirmation modal', async () => {
    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
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
    // Mock more books to test pagination
    const manyBooks = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Sách Test ${i + 1}`,
      author: `Tác giả ${i + 1}`,
      category_name: 'Test Category',
      publisher_name: 'Test Publisher',
      price: 100000,
      quantity: 10,
      sold_quantity: 5
    }));

    fetch.mockReset();
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => manyBooks
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPublishers
      });

    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    // Should have pagination info
    expect(screen.getByText(/Hiển thị.*1.*đến.*10.*của.*25.*mục/)).toBeInTheDocument();
    
    // Should have pagination buttons - use more specific selectors
    const paginationContainer = screen.getByText(/Hiển thị.*1.*đến.*10.*của.*25.*mục/).closest('.pagination');
    const paginationControls = paginationContainer.querySelector('.pagination-controls');
    
    // Check pagination buttons - note: first button is '<', then page numbers, then '>'
    const allButtons = paginationControls.querySelectorAll('.pagination-button');
    expect(allButtons[0]).toHaveTextContent('<'); // Previous button
    expect(allButtons[1]).toHaveTextContent('1'); // Page 1 (active)
    expect(allButtons[2]).toHaveTextContent('2'); // Page 2
    expect(allButtons[3]).toHaveTextContent('3'); // Page 3
    expect(allButtons[4]).toHaveTextContent('>'); // Next button
    
    // Check that page 1 is active
    expect(allButtons[1]).toHaveClass('active');
    
    // Test next page button
    const nextButton = allButtons[4]; // Last button is '>'
    fireEvent.click(nextButton);
    
    // After clicking next, should show page 2 as active
    await waitFor(() => {
      const updatedPaginationControls = screen.getByText(/Hiển thị.*11.*đến.*20.*của.*25.*mục/)
        .closest('.pagination')
        .querySelector('.pagination-controls');
      const updatedButtons = updatedPaginationControls.querySelectorAll('.pagination-button');
      expect(updatedButtons[2]).toHaveClass('active'); // Page 2 should be active
    });
  });

  it('submits book form successfully', async () => {
    // Mock successful create response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 3, title: 'Test Book', author: 'Test Author' })
    });

    renderBookTable();

    await waitFor(() => {
      expect(screen.getByText('Sách Test 1')).toBeInTheDocument();
    });

    // Open add form
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);

    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/books',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
});
