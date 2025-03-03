import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckSenderGame from '../../components/bec-security/CheckSenderGame';

jest.mock('lucide-react', () => ({
  Mail: jest.fn(() => <div data-testid="mail-icon" />),
  AlertTriangle: jest.fn(() => <div data-testid="alert-triangle-icon" />),
  CheckCircle: jest.fn(() => <div data-testid="check-circle-icon" />),
  XCircle: jest.fn(() => <div data-testid="x-circle-icon" />),
  Info: jest.fn(() => <div data-testid="info-icon" />),
  Search: jest.fn(() => <div data-testid="search-icon" />),
  Grip: jest.fn(() => <div data-testid="grip-icon" />),
  AlertCircle: jest.fn(() => <div data-testid="alert-circle-icon" />)
}));

describe('CheckSenderGame Component', () => {
  const mockEmail = {
    from: 'test@example.com',
    subject: 'Urgent Financial Request',
    timestamp: '2023-06-15 10:30 AM',
    content: 'Please transfer funds immediately.'
  };

  const mockOnComplete = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      email: mockEmail,
      onComplete: mockOnComplete
    };
    return render(<CheckSenderGame {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tutorial Rendering', () => {
    test('renders tutorial initially', () => {
      renderComponent();

      expect(
        screen.getByRole('heading', { name: /Sender Verification Training/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Start Training/i })
      ).toBeInTheDocument();
    });

    test('starts game when Start Training is clicked', async () => {
      renderComponent();

      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Submit Order/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Game Rendering', () => {
    beforeEach(async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /Submit Order/i })
        ).toBeInTheDocument()
      );
    });

    test('renders email preview', () => {
      expect(screen.getByText(mockEmail.from)).toBeInTheDocument();
      expect(screen.getByText(mockEmail.subject)).toBeInTheDocument();
      expect(screen.getByText(mockEmail.timestamp)).toBeInTheDocument();
      expect(screen.getByText(mockEmail.content)).toBeInTheDocument();
    });

    test('renders verification steps', () => {
      const expectedSteps = [
        'Verify Email Domain',
        'Validate Sender Name',
        'Examine Email Formatting',
        'Contact Verification',
        'Review Security Policy'
      ];

      expectedSteps.forEach(step => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });
  });

  describe('Step Reordering', () => {
    beforeEach(async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      await waitFor(() =>
        expect(
          screen.getByRole('button', { name: /Submit Order/i })
        ).toBeInTheDocument()
      );
    });

    test('allows selecting and reordering steps', () => {
      const stepNumbers = screen.getAllByText((content) =>
        /^\d+\.$/.test(content)
      );
      
      fireEvent.dragStart(stepNumbers[0]);
      fireEvent.drop(stepNumbers[stepNumbers.length - 1]);

      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);

      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number));
    });
  });



describe('Completion Screen', () => {
    beforeEach(async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /Submit Order/i })).toBeInTheDocument()
      );

    });
  
    test('renders completion screen', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);
  
      await waitFor(() => {
        expect(screen.getByText(/Great Job!/i)).toBeInTheDocument();
        expect(screen.getByText(/Your Score:/i)).toBeInTheDocument();
      });
    });
  
    test('allows continuing to next step on high score', async () => {
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);
  
      await waitFor(() => {
        const continueButton = screen.getByRole('button', { name: /Continue to Next Step/i });
        fireEvent.click(continueButton);
        expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number));
      });
    });
  
    test('allows trying again on low score', async () => {
      const firstStepContainer = screen
        .getByText('Verify Email Domain')
        .closest('[draggable="true"]');
      const lastStepContainer = screen
        .getByText('Review Security Policy')
        .closest('[draggable="true"]');
  
      fireEvent.dragStart(firstStepContainer, {
        dataTransfer: { setData: jest.fn(), getData: jest.fn() }
      });
      fireEvent.dragOver(lastStepContainer);
      fireEvent.drop(lastStepContainer, {
        dataTransfer: { getData: jest.fn() }
      });
  
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);
  
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      });
      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(tryAgainButton);
  
      expect(screen.getByRole('button', { name: /Submit Order/i })).toBeInTheDocument();
    });
  });
  

  describe('Error Handling', () => {
    test('renders error state when no email is provided', () => {
      renderComponent({ email: null });
      expect(
        screen.getByText('No email data available for verification')
      ).toBeInTheDocument();
    });
  });
});
