import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HomePage from '../HomePage';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

describe('HomePage Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    axios.post.mockClear();
    mockLogout.mockClear();
  });

  test('logs out successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: 'Logout successful' } });

    render(
        <Router>
          <HomePage onLogout={mockLogout} />
        </Router>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
