import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// mock data for scenarios 
jest.mock('../../data/insiderThreatScenarios', () => ({
  InsiderScenarios: {
    IT: [
      {
        title: 'IT Security Scenario',
        description: 'Test IT scenario description',
        activities: [
          {
            id: 'activity1',
            employee: 'John Doe',
            department: 'IT',
            details: 'Unusual login activity',
            // provide a simple icon component for rendering
            icon: () => <div data-testid="activity-icon" />,
            timeline: [{ isNormal: false }]
          }
        ]
      }
    ]
  }
}));

jest.mock('../../data/insiderThreatEducation', () => ({
  getInsiderThreatFeedback: jest.fn(() => ({
    isCorrect: true,
    feedbackSections: [{ title: 'Good Job', content: 'Excellent analysis' }]
  }))
}));

jest.mock('../../components/insider-threat/TimelineAnalysisView', () => {
  return jest.fn(() => <div data-testid="timeline-analysis-view">Mocked Timeline View</div>);
});

jest.mock('../../components/insider-threat/InsiderThreatFeedbackModal', () => {
  return jest.fn(({ onClose }) => (
    <div data-testid="insider-threat-feedback-modal">
      <button onClick={onClose}>Close Feedback</button>
    </div>
  ));
});

import InsiderThreatGame from '../../components/insider-threat/InsiderThreatGame';

// mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

Object.defineProperty(window, 'location', {
  value: { reload: jest.fn() },
  writable: true
});

// helper function to render component with routing
const renderComponent = (initialEntries = ['/game'], locationState = {}) => {
  const entries = initialEntries.map((path) => ({ pathname: path, state: locationState }));
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={0}>
      <Routes>
        <Route path="/game" element={<InsiderThreatGame />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('InsiderThreatGame Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Routing and Initialization', () => {
    test('redirects to dashboard when no role is provided', async () => {
      renderComponent(['/game']);
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    test('renders game interface with correct role', async () => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      
      await waitFor(() => {
        expect(screen.getByText(/Insider Threat Monitor/i)).toBeInTheDocument();
        expect(screen.getByText(/Role: IT Security - IT Security Scenario/i)).toBeInTheDocument();
        expect(screen.getByText('Test IT scenario description')).toBeInTheDocument();
      });
    });
  });

  describe('Game Progression', () => {
    beforeEach(() => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
    });

    test('completes scenario when activities are investigated', async () => {
      // wait for the Flag Suspicious button and click it.
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /Flag Suspicious/i });
        fireEvent.click(flagButton);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/Mission Complete!/i)).toBeInTheDocument();
      });
    });

    test('calculates final score', async () => {
      // Click the Flag Suspicious button to trigger investigation.
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /Flag Suspicious/i });
        fireEvent.click(flagButton);
      });

      act(() => {
        // Advance timer to allow the end-of-scenario processing.
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
    });

    test('returns to dashboard when Back to Missions is clicked', async () => {
      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /Back to Missions/i });
        fireEvent.click(backButton);
      });

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles no scenarios', async () => {
      const insiderScenarios = require('../../data/insiderThreatScenarios').InsiderScenarios;
      insiderScenarios.IT = [];

      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      await waitFor(() => {
        expect(screen.getByText(/No Scenarios Available/i)).toBeInTheDocument();
      });
    });
  });
});
