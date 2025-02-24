import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckSenderGame from '../../components/bec-security/CheckSenderGame';

// Mock Lucide icons
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

  // Tutorial Rendering Tests
  describe('Tutorial Rendering', () => {
    test('renders tutorial initially', () => {
      renderComponent();

      // Use getByRole for more reliable queries
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

      // Wait for game interface to appear (i.e. Submit Order button)
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Submit Order/i })
        ).toBeInTheDocument();
      });
    });
  });

  // Game Rendering Tests
  describe('Game Rendering', () => {
    beforeEach(async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      // Wait until the Submit Order button appears (i.e. game interface is loaded)
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

  // Drag and Drop Interaction Tests
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
      // Find all step number elements using a custom text matcher that checks for digits followed by a period.
      const stepNumbers = screen.getAllByText((content) =>
        /^\d+\.$/.test(content)
      );
      
      // Simulate drag start on the first step and drop on the last step.
      fireEvent.dragStart(stepNumbers[0]);
      fireEvent.drop(stepNumbers[stepNumbers.length - 1]);

      // Click the Submit Order button
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);

      // Verify that the onComplete callback was called with a score (a number)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number));
    });
  });

  // Completion Screen Tests
// ...other tests remain unchanged

describe('Completion Screen', () => {
    beforeEach(async () => {
      renderComponent();
      const startButton = screen.getByRole('button', { name: /Start Training/i });
      fireEvent.click(startButton);
      // Wait until game interface loads
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /Submit Order/i })).toBeInTheDocument()
      );
      // For high score tests, we can submit immediately.
      // For low score tests, we’ll simulate a reorder.
    });
  
    test('renders completion screen', async () => {
      // Submit order without reordering (high score path)
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
      // Force a low score by reordering steps incorrectly.
      // Instead of using the step number elements, we target the full draggable containers.
      const firstStepContainer = screen
        .getByText('Verify Email Domain')
        .closest('[draggable="true"]');
      const lastStepContainer = screen
        .getByText('Review Security Policy')
        .closest('[draggable="true"]');
  
      // Simulate the drag-and-drop events.
      fireEvent.dragStart(firstStepContainer, {
        dataTransfer: { setData: jest.fn(), getData: jest.fn() }
      });
      fireEvent.dragOver(lastStepContainer);
      fireEvent.drop(lastStepContainer, {
        dataTransfer: { getData: jest.fn() }
      });
  
      // Submit the order, which should yield a lower score.
      const submitButton = screen.getByRole('button', { name: /Submit Order/i });
      fireEvent.click(submitButton);
  
      // Wait for the Try Again button to appear (low score path)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      });
      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(tryAgainButton);
  
      // After trying again, the game interface should be visible again.
      expect(screen.getByRole('button', { name: /Submit Order/i })).toBeInTheDocument();
    });
  });
  

  // Error Handling Tests
  describe('Error Handling', () => {
    test('renders error state when no email is provided', () => {
      renderComponent({ email: null });
      expect(
        screen.getByText('No email data available for verification')
      ).toBeInTheDocument();
    });
  });
});
