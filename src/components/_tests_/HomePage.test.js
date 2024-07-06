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


  // test('displays error message on logout failure', async () => {
  //     axios.post.mockRejectedValueOnce(new Error('Network Error'));
  //
  //     render(
  //         <Router>
  //           <HomePage onLogout={mockLogout} />
  //         </Router>
  //     );
  //
  //     const logoutButton = screen.getByText(/Logout/i);
  //     fireEvent.click(logoutButton);
  //
  //     await waitFor(() => {
  //       expect(screen.getByText(/Error logging out/i)).toBeInTheDocument();
  //     });
  //   });

    test('displays error message on file upload failure', async () => {
      axios.post.mockRejectedValueOnce(new Error('Error uploading file'));

      render(
          <Router>
            <HomePage onLogout={mockLogout} />
          </Router>
      );

      const fileInput = screen.getByLabelText(/upload file/i);
      fireEvent.change(fileInput, { target: { files: [new File(['file contents'], 'testfile.txt')] } });

      const uploadButton = screen.getByText(/Run the ML Model with the given file/i);
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Error uploading file/i)).toBeInTheDocument();
      });
    });
  });
