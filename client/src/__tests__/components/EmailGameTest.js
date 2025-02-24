// src/__tests__/components/EmailGameTest.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as router from 'react-router-dom';
import EmailGame from '../../components/email-game/EmailGame';

// Mock fetch globally
global.fetch = jest.fn();

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  MemoryRouter: ({ children }) => <div>{children}</div>
}));

// Mock scenarios data
jest.mock('../../data/emailScenarios', () => ({
  EmailScenarios: {
    ADMIN: [
      {
        title: 'Test Scenario',
        context: 'Test Context',
        educationalPoints: ['Point 1', 'Point 2'],
        initialSituation: {
          from: 'test@example.com',
          subject: 'Test Subject',
          content: 'Test Content',
          timestamp: '10:00 AM'
        },
        options: [
          { text: 'Option 1', correct: true, points: 80, feedback: 'Good job!' },
          { text: 'Option 2', correct: false, points: 40, feedback: 'Try again!' }
        ]
      }
    ]
  }
}));

// Mock InteractiveEmail component
jest.mock('../../components/email-game/InteractiveEmail', () => {
  return function MockInteractiveEmail({ onAnalysisComplete }) {
    return (
      <div data-testid="interactive-email">
        <div className="bg-white rounded-lg">
          <button onClick={() => onAnalysisComplete(80)}>Submit Analysis</button>
        </div>
      </div>
    );
  };
});

describe('EmailGame Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock
    global.fetch.mockReset();
    // Setup default successful response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        pointsEarned: 100,
        totalPoints: 500,
        rank: 'Expert'
      })
    });
    // Setup router mocks
    router.useNavigate.mockImplementation(() => mockNavigate);
    router.useLocation.mockImplementation(() => ({
      state: { roleId: 'admin', roleName: 'Administrator' }
    }));
  });

  const completeGameFlow = async () => {
    // Dismiss tutorial
    const beginButton = screen.getByText(/begin email security investigation/i);
    fireEvent.click(beginButton);

    // First click "Submit Analysis"
    const submitButton = screen.getByText('Submit Analysis');
    fireEvent.click(submitButton);

    // Select correct option
    await waitFor(() => {
      const option = screen.getByText('Option 1');
      fireEvent.click(option);
    });
  };

  test('handles missing role ID', () => {
    router.useLocation.mockImplementation(() => ({ state: {} }));
    render(<EmailGame />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('completes game flow and shows completion modal', async () => {
    render(<EmailGame />);
    await completeGameFlow();

    // Click complete mission
    await waitFor(() => {
      const completeButton = screen.getByText('Complete Mission');
      fireEvent.click(completeButton);
    });

    // Wait for completion modal
    await waitFor(() => {
      expect(screen.getByText('Mission Complete!')).toBeInTheDocument();
      expect(screen.getByText(/Points Earned: 100/)).toBeInTheDocument();
    });
  });

  // Update just the retry button test
test('shows try again button in completion modal', async () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
  
    render(<EmailGame />);
    await completeGameFlow();
  
    // Complete the mission
    await waitFor(() => {
      const completeButton = screen.getByText('Complete Mission');
      fireEvent.click(completeButton);
    });
  
    // Wait for modal and click retry
    await waitFor(() => {
      // Using exact text match to find the button
      const retryButton = screen.getByText('Try Again', { exact: true });
      expect(retryButton).toBeInTheDocument();
      fireEvent.click(retryButton);
    });
  
    expect(mockReload).toHaveBeenCalled();
  });
  
  test('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<EmailGame />);
    await completeGameFlow();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error saving progress:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});