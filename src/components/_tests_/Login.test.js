
import '@testing-library/jest-dom';
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../Login";

describe('Login Component', () => {
  it('renders the Login component', () => {
    render(
      <Router>
        <Login onFormSwitch={jest.fn()} />
      </Router>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('displays error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid password' }),
      })
    );

    render(
      <Router>
        <Login onFormSwitch={jest.fn()} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'WrongPassword!' } });
    fireEvent.click(screen.getByText(/Log In/i));

    expect(await screen.findByText(/Invalid password/i)).toBeInTheDocument();
  });

  it('submits the login form successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Login successful' }),
      })
    );

    const onFormSwitch = jest.fn();
    render(
      <Router>
        <Login onFormSwitch={onFormSwitch} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByText(/Log In/i));

    await waitFor(() => {
      expect(onFormSwitch).toHaveBeenCalledWith("HomePage", "test@example.com");
    });
  });
});
