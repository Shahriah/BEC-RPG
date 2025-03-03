
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import PolicyVerificationGame from '../../components/bec-security/PolicyVerificationGame';


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

    
    expect(screen.getByText(/Time Remaining: 60s/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000); 
    });

    expect(screen.getByText(/Time Remaining: 59s/i)).toBeInTheDocument();
  });

  test('policy selection toggles correctly', () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    
    const policyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    expect(policyButton).toBeInTheDocument();

    
    fireEvent.click(policyButton);
    
    expect(policyButton).toHaveClass('border-blue-500');

    
    fireEvent.click(policyButton);
    expect(policyButton).not.toHaveClass('border-blue-500');
  });

  test('calculates score correctly for a perfect selection', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    
    
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

    
    expect(screen.getByText(/Your Score: 100%/i)).toBeInTheDocument();

    
    const continueButton = screen.getByText(/Continue to Next Step/i);
    expect(continueButton).toBeInTheDocument();

    
    fireEvent.click(continueButton);
    expect(onCompleteMock).toHaveBeenCalledWith(100);
  });

  test('calculates score correctly with incorrect selections', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    
    const correctPolicyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    const incorrectPolicyButton = screen.getByText(/Data Access Protocol/i).closest('button');

    fireEvent.click(correctPolicyButton);
    fireEvent.click(incorrectPolicyButton);

    fireEvent.click(screen.getByText(/Submit Analysis/i));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    
    
    
    expect(screen.getByText(/Your Score: 15%/i)).toBeInTheDocument();

    
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  test('automatically submits the analysis when the timer reaches 0', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    
    expect(onCompleteMock).toHaveBeenCalled();
  });

  test('clicking "Try Again" resets the game state', async () => {
    render(<PolicyVerificationGame email={emailMock} onComplete={onCompleteMock} />);
    fireEvent.click(screen.getByText(/Start Training/i));

    
    const correctPolicyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    const incorrectPolicyButton = screen.getByText(/Data Access Protocol/i).closest('button');
    fireEvent.click(correctPolicyButton);
    fireEvent.click(incorrectPolicyButton);

    fireEvent.click(screen.getByText(/Submit Analysis/i));

    await waitFor(() => {
      expect(screen.getByText(/Analysis Complete/i)).toBeInTheDocument();
    });

    
    fireEvent.click(screen.getByText(/Try Again/i));

    
    expect(screen.getByText(/Time Remaining: 60s/i)).toBeInTheDocument();
    
    const policyButton = screen.getByText(/Financial Approval Process/i).closest('button');
    expect(policyButton).not.toHaveClass('border-blue-500');
  });
});
