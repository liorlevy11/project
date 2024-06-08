import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../Register';
import '@testing-library/jest-dom';

describe('Register Component', () => {
  test('renders Register component and submits form', async () => {
    render(<Register onFormSwitch={jest.fn()} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const nameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByText(/submit/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/user registered successfully/i)).toBeInTheDocument();
    });
  });
});
