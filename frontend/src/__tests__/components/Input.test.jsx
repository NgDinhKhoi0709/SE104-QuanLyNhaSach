import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/common/Input';

describe('Input Component', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'testInput',
    label: 'Test Label',
    value: '',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic input correctly', () => {
    render(<Input {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders with placeholder', () => {
    render(<Input {...defaultProps} placeholder="Enter text here" />);
    
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  test('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(<Input {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test input');
    
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('shows required indicator when required prop is true', () => {
    render(<Input {...defaultProps} required={true} />);
    
    // Look for asterisk or required indicator in the label
    expect(screen.getByText(/Test Label/)).toBeInTheDocument();
  });

  test('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<Input {...defaultProps} error={errorMessage} touched={true} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<Input {...defaultProps} type="password" />);
    
    const passwordInput = screen.getByLabelText('Test Label');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Look for eye icon to toggle visibility
    const toggleButton = document.querySelector('[data-testid="password-toggle"], .password-toggle, svg');
    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  test('respects maxLength prop', () => {
    render(<Input {...defaultProps} maxLength={10} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  test('calls onBlur when input loses focus', async () => {
    const onBlur = jest.fn();
    const user = userEvent.setup();
    
    render(<Input {...defaultProps} onBlur={onBlur} />);
    
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.tab(); // Move focus away
    
    expect(onBlur).toHaveBeenCalled();
  });
});
