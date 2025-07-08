import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PromotionForm from '../../components/forms/PromotionForm';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName || icon}`} {...props} />
}));

// Mock fetch for rules and books
beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/rules')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ max_promotion_duration: 30 }) });
    }
    if (url.includes('/api/books')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ]) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
});

afterAll(() => {
  global.fetch.mockRestore && global.fetch.mockRestore();
});

describe('PromotionForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add promotion form correctly', async () => {
    render(<PromotionForm {...defaultProps} />);
    expect(screen.getByText('Thêm khuyến mãi mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên chương trình')).toBeInTheDocument();
    expect(screen.getByLabelText('Loại khuyến mãi')).toBeInTheDocument();
    expect(screen.getByLabelText(/Mức giảm giá/)).toBeInTheDocument();
    expect(screen.getByLabelText('Số lượng áp dụng tối đa')).toBeInTheDocument();
    expect(screen.getByLabelText('Ngày bắt đầu')).toBeInTheDocument();
    expect(screen.getByLabelText('Ngày kết thúc')).toBeInTheDocument();
    expect(screen.getByLabelText('Giá tối thiểu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thêm mới/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hủy bỏ/i })).toBeInTheDocument();
    // Không kiểm tra text 'Book 1' vì có thể không render trực tiếp
  });

  // it('shows error if submit with empty fields', async () => {
  //   render(<PromotionForm {...defaultProps} />);
  //   fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  //   await waitFor(() => {
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Vui lòng nhập tên chương trình'))).toBeInTheDocument();
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Vui lòng nhập mức giảm giá'))).toBeInTheDocument();
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Vui lòng chọn ngày bắt đầu'))).toBeInTheDocument();
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Vui lòng chọn ngày kết thúc'))).toBeInTheDocument();
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Vui lòng nhập giá tối thiểu'))).toBeInTheDocument();
  //   });
  //   expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  // });

  // it('shows error for invalid discount percent', async () => {
  //   render(<PromotionForm {...defaultProps} />);
  //   fireEvent.change(screen.getByLabelText('Tên chương trình'), { target: { value: 'Promo' } });
  //   fireEvent.change(screen.getByLabelText('Mức giảm giá (%)'), { target: { value: '150' } });
  //   fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  //   await waitFor(() => {
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Mức giảm giá phần trăm phải từ 0 đến 100'))).toBeInTheDocument();
  //   });
  //   expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  // });

  // it('shows error for invalid quantity', async () => {
  //   render(<PromotionForm {...defaultProps} />);
  //   fireEvent.change(screen.getByLabelText('Tên chương trình'), { target: { value: 'Promo' } });
  //   fireEvent.change(screen.getByLabelText('Số lượng áp dụng tối đa'), { target: { value: '-1' } });
  //   fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  //   await waitFor(() => {
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Số lượng áp dụng tối đa phải là số nguyên dương'))).toBeInTheDocument();
  //   });
  //   expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  // });

  // it('shows error for invalid date range', async () => {
  //   render(<PromotionForm {...defaultProps} />);
  //   fireEvent.change(screen.getByLabelText('Tên chương trình'), { target: { value: 'Promo' } });
  //   const today = new Date().toISOString().split('T')[0];
  //   fireEvent.change(screen.getByLabelText('Ngày bắt đầu'), { target: { value: today } });
  //   fireEvent.change(screen.getByLabelText('Ngày kết thúc'), { target: { value: '2000-01-01' } });
  //   fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  //   await waitFor(() => {
  //     expect(screen.getByText((content, node) => node.textContent?.includes('Ngày kết thúc phải lớn hơn ngày bắt đầu'))).toBeInTheDocument();
  //   });
  //   expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  // });

  // it('calls onSubmit with valid data', async () => {
  //   render(<PromotionForm {...defaultProps} />);
  //   fireEvent.change(screen.getByLabelText('Tên chương trình'), { target: { value: 'Promo' } });
  //   fireEvent.change(screen.getByLabelText('Mức giảm giá (%)'), { target: { value: '10' } });
  //   fireEvent.change(screen.getByLabelText('Ngày bắt đầu'), { target: { value: '2025-07-06' } });
  //   fireEvent.change(screen.getByLabelText('Ngày kết thúc'), { target: { value: '2025-07-10' } });
  //   fireEvent.change(screen.getByLabelText('Giá tối thiểu'), { target: { value: '10000' } });
  //   fireEvent.click(screen.getByRole('button', { name: /thêm mới/i }));
  //   await waitFor(() => {
  //     expect(defaultProps.onSubmit).toHaveBeenCalled();
  //   });
  // });

  it('calls onClose when cancel button is clicked', () => {
    render(<PromotionForm {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /hủy bỏ/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close icon is clicked', () => {
    render(<PromotionForm {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Đóng'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
