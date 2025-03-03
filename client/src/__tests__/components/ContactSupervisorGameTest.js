import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactSupervisorGame from '../../components/bec-security/ContactSupervisorGame';
import { VerificationGameType } from '../../types/becSecurityTypes';

const mockEmail = {
  from: 'test@example.com',
  subject: 'Urgent Request',
  timestamp: '2023-06-15 10:30 AM',
  content: 'Please contact your supervisor immediately.'
};

describe('ContactSupervisorGame Component', () => {
  const mockOnComplete = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <ContactSupervisorGame
        email={mockEmail}
        onComplete={mockOnComplete}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });



  describe('Tutorial Rendering', () => {
    test('renders tutorial initially', () => {
      renderComponent();
      expect(
        screen.getByRole('heading', { name: /Supervisor Communication Training/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Your Task:/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Start Training/i })
      ).toBeInTheDocument();
    });

    test('dismisses tutorial on clicking Start Training', async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: /Start Training/i })).not.toBeInTheDocument()
      );
      expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    });
  });

  describe('Game Content Rendering', () => {
    beforeEach(async () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument()
      );
    });



    test('renders all option buttons for the current step', () => {
      expect(
        screen.getByRole('button', { name: /Unusual urgency and pressure tactics/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Large financial transaction request/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Sender's office location/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Limited verification channels/i })
      ).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    beforeEach(async () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument()
      );
    });

    test('toggles option selection for step 0', () => {
      const optionButton = screen.getByRole('button', {
        name: /Unusual urgency and pressure tactics/i
      });
      expect(optionButton).not.toHaveClass('bg-blue-50');
      fireEvent.click(optionButton);
      expect(optionButton).toHaveClass('bg-blue-50');
      fireEvent.click(optionButton);
      expect(optionButton).not.toHaveClass('bg-blue-50');
    });
  });

  describe('Step Progression', () => {
    test('advances to the next step on clicking Next Step', async () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
      fireEvent.click(
        screen.getByRole('button', { name: /Unusual urgency and pressure tactics/i })
      );
      fireEvent.click(
        screen.getByRole('button', { name: /Large financial transaction request/i })
      );
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
      await waitFor(() =>
        expect(screen.getByText(/Step\s*2\s*of\s*3/i)).toBeInTheDocument()
      );
      expect(
        screen.getByText("How should you contact your supervisor?")
      ).toBeInTheDocument();
    });
  });

  describe('Final Feedback', () => {
    const highScoreSelections = {
      step0: [
        /Unusual urgency and pressure tactics/i,
        /Large financial transaction request/i,
        /Limited verification channels/i
      ],
      step1: [
        /Call their official phone number/i,
        /Walk to their office if possible/i
      ],
      step2: [
        /Forward the suspicious email/i,
        /Identified security red flags/i,
        /Actions you've already taken/i
      ]
    };

    beforeEach(async () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
      for (const optionRegex of highScoreSelections.step0) {
        fireEvent.click(screen.getByRole('button', { name: optionRegex }));
      }
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
      for (const optionRegex of highScoreSelections.step1) {
        fireEvent.click(screen.getByRole('button', { name: optionRegex }));
      }
      fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
      for (const optionRegex of highScoreSelections.step2) {
        fireEvent.click(screen.getByRole('button', { name: optionRegex }));
      }
      fireEvent.click(screen.getByRole('button', { name: /Complete Training/i }));
      await waitFor(() => {
        expect(screen.getByText(/Training Completed/i)).toBeInTheDocument();
        expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
      });
    });

    test('renders final feedback screen', () => {
      expect(screen.getByText(/Training Completed/i)).toBeInTheDocument();
      expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Step 1: What are the key concerns to report\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Step 2: How should you contact your supervisor\?/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Step 3: What information should you share\?/i)
      ).toBeInTheDocument();
    });

    test('calls onComplete with correct parameters when Complete Training is clicked', async () => {
      fireEvent.click(screen.getByRole('button', { name: /Complete Training/i }));
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
      expect(mockOnComplete.mock.calls[0][0]).toBe(VerificationGameType.CONTACT_SUPERVISOR);
      expect(typeof mockOnComplete.mock.calls[0][1]).toBe('number');
    });
  });

  describe('Timer Expiry', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('automatically submits the current step when time reaches 0', async () => {
      renderComponent();
      fireEvent.click(screen.getByRole('button', { name: /Start Training/i }));
      act(() => {
        jest.advanceTimersByTime(45000);
      });
      // Expect the step to auto-submit and advance to step 2.
      await waitFor(() =>
        expect(screen.getByText(/Step\s*2\s*of\s*3/i)).toBeInTheDocument()
      );
    });
  });
});
