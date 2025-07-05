import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupplierTable from '../../components/tables/SupplierTable';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock child components
jest.mock('../../components/forms/SupplierForm', () => {
  return function MockSupplierForm({ onSubmit, onCancel, supplier }) {
    return (
      <div data-testid="supplier-form">
        <h3>{supplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h3>
        <button onClick={() => onSubmit({ name: 'Test Supplier', contact: 'Test Contact' })}>
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

describe('SupplierTable', () => {
  const mockSuppliers = [
    {
      id: 1,
      name: 'Nhà cung cấp 1',
      contact: 'Liên hệ 1',
      phone: '0123456789',
      email: 'supplier1@test.com',
      address: 'Địa chỉ 1'
    },
    {
      id: 2,
      name: 'Nhà cung cấp 2',
      contact: 'Liên hệ 2',
      phone: '0987654321',
      email: 'supplier2@test.com',
      address: 'Địa chỉ 2'
    }
  ];

  beforeEach(() => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuppliers
    });
  });

  it('renders supplier table with data', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
      expect(screen.getByText('Nhà cung cấp 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Địa chỉ 1')).toBeInTheDocument();
    expect(screen.getByText('0123456789')).toBeInTheDocument();
    expect(screen.getByText('supplier1@test.com')).toBeInTheDocument();
  });

  it('opens add supplier form when clicking add button', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);

    expect(screen.getByTestId('supplier-form')).toBeInTheDocument();
    expect(screen.getByText('Thêm nhà cung cấp mới')).toBeInTheDocument();
  });

  it('opens edit form when clicking edit button', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    // Select a row first
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Click the edit button in the toolbar
    const editButton = screen.getByText('Sửa').closest('button');
    fireEvent.click(editButton);

    expect(screen.getByTestId('supplier-form')).toBeInTheDocument();
    expect(screen.getByText('Sửa nhà cung cấp')).toBeInTheDocument();
  });

  it('filters suppliers by search term', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
      expect(screen.getByText('Nhà cung cấp 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Nhập tên nhà cung cấp...');
    fireEvent.change(searchInput, { target: { value: 'Nhà cung cấp 1' } });

    // Test search functionality
    expect(searchInput.value).toBe('Nhà cung cấp 1');
  });

  it('selects and deselects rows', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip the "select all" checkbox

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).not.toBeChecked();
  });

  it('shows delete confirmation modal', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
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
    // Mock more suppliers to test pagination
    const manySuppliers = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Nhà cung cấp ${i + 1}`,
      contact: `Liên hệ ${i + 1}`,
      phone: `012345678${i}`,
      email: `supplier${i + 1}@test.com`,
      address: `Địa chỉ ${i + 1}`
    }));

    fetch.mockReset();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manySuppliers
    });

    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    // Should have pagination info
    expect(screen.getByText(/Hiển thị.*1.*đến.*10.*của.*25.*mục/)).toBeInTheDocument();
    
    // Should have pagination buttons
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Test next page button
    const nextButton = screen.getByText('>');
    fireEvent.click(nextButton);
    
    // After clicking next, should show page 2 as active
    await waitFor(() => {
      expect(screen.getByText('2')).toHaveClass('active');
    });
  });

  it('submits supplier form successfully', async () => {
    // Mock successful create response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 3, name: 'Test Supplier', contact: 'Test Contact' })
    });

    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    // Open add form
    const addButton = screen.getByText('Thêm mới');
    fireEvent.click(addButton);

    // Submit form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/suppliers',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  it('handles fetch error gracefully', async () => {
    fetch.mockReset();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<SupplierTable />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching suppliers'),
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('changes search field correctly', async () => {
    render(<SupplierTable />);

    await waitFor(() => {
      expect(screen.getByText('Nhà cung cấp 1')).toBeInTheDocument();
    });

    const searchFieldSelector = screen.getByRole('combobox');
    fireEvent.change(searchFieldSelector, { target: { value: 'email' } });

    expect(searchFieldSelector.value).toBe('email');
  });
});
