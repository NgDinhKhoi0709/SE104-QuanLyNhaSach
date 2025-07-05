import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../../components/common/Loading';

describe('Loading Component', () => {
  test('renders with default message', () => {
    render(<Loading />);
    
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    expect(document.querySelector('.loading-container')).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Đang xử lý dữ liệu...';
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<Loading />);
    
    const container = document.querySelector('.loading-container');
    const spinner = document.querySelector('.loading-spinner');
    
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });
});
