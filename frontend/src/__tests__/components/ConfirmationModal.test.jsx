import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => <i data-testid={`icon-${icon.iconName}`} {...props} />
}));

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Xác nhận',
    message: 'Bạn có chắc chắn muốn thực hiện hành động này?'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    // Use getAllByText for elements that appear multiple times
    expect(screen.getAllByText('Xác nhận')).toHaveLength(2); // Title and button
    expect(screen.getByText('Bạn có chắc chắn muốn thực hiện hành động này?')).toBeInTheDocument();
    expect(screen.getByText('Hủy bỏ')).toBeInTheDocument(); // Actual button text is "Hủy bỏ"
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Xác nhận')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const confirmButton = screen.getAllByText('Xác nhận')[1]; // Second one is the button
    fireEvent.click(confirmButton);
    
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Hủy bỏ');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Đóng');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows trash icon for delete actions', () => {
    render(<ConfirmationModal {...defaultProps} title="Xác nhận xóa" />);
    
    expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
  });

  it('shows key icon for password actions', () => {
    render(<ConfirmationModal {...defaultProps} title="Đặt lại mật khẩu" />);
    
    expect(screen.getByTestId('icon-key')).toBeInTheDocument();
  });

  it('shows lock-open icon for activation actions', () => {
    render(<ConfirmationModal {...defaultProps} title="Thay đổi trạng thái" message="Bạn có muốn kích hoạt tài khoản này?" />);
    
    expect(screen.getByTestId('icon-lock-open')).toBeInTheDocument();
  });

  it('shows lock icon for deactivation actions', () => {
    render(<ConfirmationModal {...defaultProps} title="Thay đổi trạng thái" message="Bạn có muốn khóa tài khoản này?" />);
    
    expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
  });

  it('shows warning icon by default', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByTestId('icon-triangle-exclamation')).toBeInTheDocument();
  });

  it('backdrop exists but does not close modal when clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const backdrop = document.querySelector('.modal-backdrop');
    fireEvent.click(backdrop);
    
    // The modal does not implement backdrop-to-close functionality
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('does not close modal when clicking modal content', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const modalContent = document.querySelector('.modal-content');
    fireEvent.click(modalContent);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
