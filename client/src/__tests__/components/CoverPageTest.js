import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoverPage from '../../components/CoverPage';
import { MemoryRouter } from 'react-router-dom';

describe('CoverPage Component', () => {
  // mokc window change to detect changes 
  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  test('renders header with title and description', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Cyber Defense Training/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to your security training platform/i)).toBeInTheDocument();
  });

  test('renders four game boxes with appropriate content', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Email Urgency Detection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Insider Threat Detection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Business Email Security/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Data Security Protocol/i })).toBeInTheDocument();

    expect(screen.getByText(/Click on suspicious elements in the email/i)).toBeInTheDocument();
  });

  test('renders roles and achievements box with available roles and rank progression', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    );

    // role selcetion checks
    expect(screen.getByRole('heading', { name: /Role Selection/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Achievements/i })).toBeInTheDocument();

    expect(screen.getByText(/CEO:/i)).toBeInTheDocument();
    expect(screen.getByText(/Finance:/i)).toBeInTheDocument();
    expect(screen.getByText(/IT Security:/i)).toBeInTheDocument();
    expect(screen.getByText(/HR:/i)).toBeInTheDocument();
    expect(screen.getByText(/Rookie:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cyber Master:/i)).toBeInTheDocument();
  });

  test('renders start button and navigates to dashboard on click', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    );
    const startButton = screen.getByRole('button', { name: /Start Training/i });
    expect(startButton).toBeInTheDocument();

    // simulate click on the start button
    fireEvent.click(startButton);
    expect(window.location.href).toBe('/dashboard');
  });
});
