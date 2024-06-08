import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";

import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "../HomePage";

describe('HomePage Component', () => {
  it('renders the HomePage component', () => {
    render(
      <Router>
        <HomePage onLogout={jest.fn()} />
      </Router>
    );
    expect(screen.getByText(/Detect an Obfuscated Code/i)).toBeInTheDocument();
  });

  it('logs out successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Logout successful' }),
      })
    );

    const onLogout = jest.fn();
    render(
      <Router>
        <HomePage onLogout={onLogout} />
      </Router>
    );

    fireEvent.click(screen.getByText(/Logout/i));

    await waitFor(() => {
      expect(onLogout).toHaveBeenCalled();
    });
  });
});
