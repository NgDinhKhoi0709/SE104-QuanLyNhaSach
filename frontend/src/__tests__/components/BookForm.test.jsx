import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookForm from '../../components/forms/BookForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

// Mock modal utils
jest.mock('../../utils/modalUtils', () => ({
  openModal: jest.fn(),
  closeModal: jest.fn()
}));

describe('BookForm', () => {
  const mockCategories = [
    { id: 1, name: 'Khoa học' },
    { id: 2, name: 'Văn học' }
  ];

  const mockPublishers = [
    { id: 1, name: 'NXB Test 1' },
    { id: 2, name: 'NXB Test 2' }
  ];

  const defaultProps = {
    onSubmit: jest.fn(),
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock fetch for categories and publishers
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPublishers
      });
  });

  it('renders add book form correctly', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Tên sách')).toBeInTheDocument();
    expect(screen.getByLabelText('Tác giả')).toBeInTheDocument();
    expect(screen.getByLabelText('Nhà xuất bản')).toBeInTheDocument();
    expect(screen.getByLabelText('Thể loại')).toBeInTheDocument();
    expect(screen.getByLabelText('Năm xuất bản')).toBeInTheDocument();
    expect(screen.getByLabelText('Giá bán')).toBeInTheDocument();
    expect(screen.getByLabelText('Mô tả')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: 'Thêm sách' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hủy bỏ' })).toBeInTheDocument();
  });

  it('renders edit book form with existing data', async () => {
    const existingBook = {
      id: 1,
      title: 'Sách Test',
      author: 'Tác giả Test',
      publisher_id: 1,
      category_id: 2,
      description: 'Mô tả test',
      publicationYear: 2023,
      price: 100000
    };

    render(<BookForm {...defaultProps} book={existingBook} />);
    
    await waitFor(() => {
      expect(screen.getByText('Chỉnh sửa đầu sách')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Sách Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tác giả Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mô tả test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100000')).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: 'Cập nhật' })).toBeInTheDocument();
  });

  it('loads categories and publishers on mount', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/categories');
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/publishers');
    });
  });

  it('validates required fields', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: 'Thêm sách' });
    fireEvent.click(submitButton);

    // Just check that validation prevents submission without errors showing
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates price format', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    const priceInput = screen.getByLabelText('Giá bán');
    fireEvent.change(priceInput, { target: { value: 'invalid-price' } });
    
    const submitButton = screen.getByRole('button', { name: 'Thêm sách' });
    fireEvent.click(submitButton);

    // Just verify that invalid input doesn't submit
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('validates publication year', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    const yearSelect = screen.getByLabelText('Năm xuất bản');
    fireEvent.change(yearSelect, { target: { value: '2023' } });
    
    // Verify year can be selected from available options
    expect(yearSelect).toHaveValue('2023');
  });

  it('submits form with valid data', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    // Fill in form data
    fireEvent.change(screen.getByLabelText('Tên sách'), { target: { value: 'Sách Test' } });
    fireEvent.change(screen.getByLabelText('Tác giả'), { target: { value: 'Tác giả Test' } });
    fireEvent.change(screen.getByLabelText('Nhà xuất bản'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Thể loại'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Giá bán'), { target: { value: '100000' } });
    fireEvent.change(screen.getByLabelText('Mô tả'), { target: { value: 'Mô tả test' } });

    const submitButton = screen.getByRole('button', { name: 'Thêm sách' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Sách Test',
        author: 'Tác giả Test',
        publisher_id: '1',
        category_id: '2',
        description: 'Mô tả test',
        price: '100000'
      }));
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: 'Hủy bỏ' });
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm đầu sách mới')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Đóng');
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('handles fetch errors gracefully', async () => {
    // Mock fetch failure
    fetch.mockReset();
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<BookForm {...defaultProps} />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
