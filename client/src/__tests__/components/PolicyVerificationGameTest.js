// PolicyVerificationGame.test.jsx
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import PolicyVerificationGame from '../../components/bec-security/PolicyVerificationGame';

// Use fake timers to control the countdown behavior
jest.useFakeTimers();

describe('PolicyVerificationGame Component', () => {
  const emailMock = {
    from: 'test@example.com',
    subject: 'Test Email Subject',
    timestamp: '2025-02-23 12:00:00',
    content: 'This is a sample email content for testing purposes.'
  };

  const onCompleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllTimers();
    onCompleteMock.mockClear();
  });

  test('renders the tutorial view initially', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    expect(screen.getByText(/Policy Verification Training/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Training/i)).toBeInTheDocument();
  });

  test('transitions from tutorial to main game view when Start Training is clicked', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));
    expect(screen.queryByText(/Policy Verification Training/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Time Remaining:/i)).toBeInTheDocument();
  });

  test('displays email preview with provided email details', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    expect(screen.getByText(/From:/i)).toBeInTheDocument();
    expect(screen.getByText(emailMock.from)).toBeInTheDocument();
    expect(screen.getByText(/Subject:/i)).toBeInTheDocument();
    expect(screen.getByText(emailMock.subject)).toBeInTheDocument();
    expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    expect(screen.getByText(emailMock.timestamp)).toBeInTheDocument();
    expect(screen.getByText(emailMock.content)).toBeInTheDocument();
  });

  test('timer counts down every second', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // Initially, timeRemaining should be 60 seconds
    expect(screen.getByText(/Time Remaining: 60s/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); // Advance time by 1 second
    });

    expect(screen.getByText(/Time Remaining: 59s/i)).toBeInTheDocument();
  });

  test('policy selection toggles correctly', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // Select the "Financial Approval Process" policy
    const policyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    expect(policyButton).toBeInTheDocument();

    // Click to select it
    fireEvent.click(policyButton);
    // Check that the button now has a class indicating selection (e.g. 'border-blue-500')
    expect(policyButton).toHaveClass('border-blue-500');

    // Click again to deselect it
    fireEvent.click(policyButton);
    expect(policyButton).not.toHaveClass('border-blue-500');
  });

  test('calculates score correctly for a perfect selection', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // There are four relevant policies:
    // "Financial Approval Process", "Urgency Protocol", "Vendor Detail Changes", "Communication Channels"
    const relevantPolicyTitles = [
      'Financial Approval Process',
      'Urgency Protocol',
      'Vendor Detail Changes',
      'Communication Channels'
    ];

    relevantPolicyTitles.forEach(title => {
      const button = screen.getByText(new RegExp(title, 'i')).closest('button');
      fireEvent.click(button);
    });

    fireEvent.click(screen.getByText(/Submit Analysis/i));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    // Score calculation: (4/4)*100 - (0*10) = 100%
    expect(screen.getByText(/Your Score: 100%/i)).toBeInTheDocument();

    // Verify that the "Continue to Next Step" button is displayed
    const continueButton = screen.getByText(/Continue to Next Step/i);
    expect(continueButton).toBeInTheDocument();

    // Simulate clicking the continue button to call onComplete with score 100
    fireEvent.click(continueButton);
    expect(onCompleteMock).toHaveBeenCalledWith(100);
  });

  test('calculates score correctly with incorrect selections', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // Select one correct policy ("Financial Approval Process") and one incorrect policy ("Data Access Protocol")
    const correctPolicyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    const incorrectPolicyButton = screen.getByText(/Data Access Protocol/i).closest('button');

    fireEvent.click(correctPolicyButton);
    fireEvent.click(incorrectPolicyButton);

    fireEvent.click(screen.getByText(/Submit Analysis/i));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    // Calculation:
    // relevantPolicies = 4, correctSelections = 1, incorrectSelections = 1.
    // Score = (1/4)*100 - (1*10) = 25 - 10 = 15%
    expect(screen.getByText(/Your Score: 15%/i)).toBeInTheDocument();

    // "Try Again" button should be visible since score < 70
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  test('automatically submits the analysis when the timer reaches 0', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // Advance the timer to 0 seconds
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    // onComplete should have been called (score may be 0 if no selections were made)
    expect(onCompleteMock).toHaveBeenCalled();
  });

  test('clicking "Try Again" resets the game state', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    // Create a low score scenario: select one correct and one incorrect policy
    const correctPolicyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    const incorrectPolicyButton = screen.getByText(/Data Access Protocol/i).closest('button');
    fireEvent.click(correctPolicyButton);
    fireEvent.click(incorrectPolicyButton);

    fireEvent.click(screen.getByText(/Submit Analysis/i));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    // Click the "Try Again" button
    fireEvent.click(screen.getByText(/Try Again/i));

    // Verify that the main game view has reset (e.g., timer resets to 60 seconds)
    expect(screen.getByText(/Time Remaining: 60s/i)).toBeInTheDocument();
    // Also verify that no policies are currently selected
    const policyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    expect(policyButton).not.toHaveClass('border-blue-500');
  });
});
