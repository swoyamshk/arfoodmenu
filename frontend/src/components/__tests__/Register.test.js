import { render, screen } from '@testing-library/react';
import Register from '../Register';
import axios from 'axios';
// const axios = require('axios');
describe('Register Component - Unit Test', () => {
  test('should render registration form', () => {
    render(<Register setToken={jest.fn()} />);

    // Check if the form elements are rendered
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Agree with Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });
});
