import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlertTriangle, Clock, Shield, Check, X } from 'lucide-react';
import ActivityCard from '../../components/insider-threat/InsiderActivityCard';


jest.mock('lucide-react', () => ({
  AlertTriangle: jest.fn(() => <div data-testid="alert-triangle-icon" />),
  Clock: jest.fn(() => <div data-testid="clock-icon" />),
  Shield: jest.fn(() => <div data-testid="shield-icon" />),
  Check: jest.fn(() => <div data-testid="check-icon" />),
  X: jest.fn(() => <div data-testid="x-icon" />),
}));

describe('ActivityCard Component', () => {
  const mockActivity = {
    id: '1',
    icon: Shield,
    employee: 'John Doe',
    department: 'IT',
    accessLevel: 'Level 2',
    timestamp: '2023-06-15 10:30 AM',
    details: 'Accessed sensitive database',
    riskScore: 65,
    flags: ['Unusual Access Time', 'Unexpected Database Query'],
    isSuspicious: true
  };

  const mockProps = {
    activity: mockActivity,
    onInvestigate: jest.fn(),
    onFlag: jest.fn(),
    onAnalyze: jest.fn(),
    isInvestigated: false,
    isFlagged: false,
    isAnalyzed: false
  };

  const renderComponent = (props = {}) => {
    const combinedProps = { ...mockProps, ...props };
    return render(<ActivityCard {...combinedProps} />);
  };

  
  describe('Rendering', () => {
    test('renders basic activity information correctly', () => {
      renderComponent();

      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT • Level 2')).toBeInTheDocument();
      expect(screen.getByText('2023-06-15 10:30 AM')).toBeInTheDocument();
      expect(screen.getByText('Accessed sensitive database')).toBeInTheDocument();
    });

    test('displays correct risk score color', () => {
      const { container } = renderComponent({
        activity: { ...mockActivity, riskScore: 75 }
      });

      const iconContainer = container.querySelector('div[class*="bg-red-100"]');
      expect(iconContainer).toBeInTheDocument();
    });

    test('renders flags when activity is flagged', () => {
      renderComponent({ isFlagged: true });

      expect(screen.getByText('Unusual Access Time')).toBeInTheDocument();
      expect(screen.getByText('Unexpected Database Query')).toBeInTheDocument();
    });
  });

  
  describe('Button Interactions', () => {
    test('calls onInvestigate when Investigate button is clicked', () => {
      renderComponent();
      
      const investigateButton = screen.getByText('Investigate');
      fireEvent.click(investigateButton);

      expect(mockProps.onInvestigate).toHaveBeenCalledWith('1');
    });

    test('calls onFlag when Flag button is clicked', () => {
      renderComponent();
      
      const flagButton = screen.getByText('Flag as Suspicious');
      fireEvent.click(flagButton);

      expect(mockProps.onFlag).toHaveBeenCalledWith('1');
    });

    test('changes flag button state when flagged', () => {
      renderComponent({ isFlagged: true });
      
      const flaggedButton = screen.getByText('Flagged as Suspicious');
      expect(flaggedButton).toHaveClass('bg-red-100');
    });

    test('calls onAnalyze when Complete Analysis is clicked', () => {
      renderComponent();
      
      const analyzeButton = screen.getByText('Complete Analysis');
      fireEvent.click(analyzeButton);

      expect(mockProps.onAnalyze).toHaveBeenCalledWith('1', false);
    });
  });

  
  describe('Feedback Rendering', () => {
    test('shows correct feedback for suspicious activity flagged correctly', () => {
      renderComponent({ 
        activity: { ...mockActivity, isSuspicious: true },
        isFlagged: true 
      });
      
      const analyzeButton = screen.getByText('Complete Analysis');
      fireEvent.click(analyzeButton);

      expect(screen.getByText('This was suspicious activity!')).toBeInTheDocument();
      expect(screen.getByText('Good catch! You correctly identified the suspicious behavior.')).toBeInTheDocument();
    });

    test('shows correct feedback for suspicious activity missed', () => {
      renderComponent({ 
        activity: { ...mockActivity, isSuspicious: true },
        isFlagged: false 
      });
      
      const analyzeButton = screen.getByText('Complete Analysis');
      fireEvent.click(analyzeButton);

      expect(screen.getByText('This was suspicious activity!')).toBeInTheDocument();
      expect(screen.getByText('You missed some suspicious indicators. Always investigate unusual patterns.')).toBeInTheDocument();
    });

    test('shows correct feedback for normal activity', () => {
      renderComponent({ 
        activity: { ...mockActivity, isSuspicious: false },
        isFlagged: false 
      });
      
      const analyzeButton = screen.getByText('Complete Analysis');
      fireEvent.click(analyzeButton);

      expect(screen.getByText('This was normal activity.')).toBeInTheDocument();
      expect(screen.getByText('Correct! This activity follows normal patterns.')).toBeInTheDocument();
    });

    test('shows correct feedback for false positive', () => {
      renderComponent({ 
        activity: { ...mockActivity, isSuspicious: false },
        isFlagged: true 
      });
      
      const analyzeButton = screen.getByText('Complete Analysis');
      fireEvent.click(analyzeButton);

      expect(screen.getByText('This was normal activity.')).toBeInTheDocument();
      expect(screen.getByText('This was a false positive. Be careful not to over-flag normal activities.')).toBeInTheDocument();
    });
  });

  
  describe('Edge Cases', () => {
    test('renders without flags', () => {
      renderComponent({ 
        activity: { ...mockActivity, flags: undefined },
        isFlagged: true 
      });

      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('handles low risk score', () => {
      const { container } = renderComponent({
        activity: { ...mockActivity, riskScore: 30 }
      });

      const iconContainer = container.querySelector('div[class*="bg-green-100"]');
      expect(iconContainer).toBeInTheDocument();
    });

    test('handles medium risk score', () => {
      const { container } = renderComponent({
        activity: { ...mockActivity, riskScore: 50 }
      });

      const iconContainer = container.querySelector('div[class*="bg-yellow-100"]');
      expect(iconContainer).toBeInTheDocument();
    });
  });
});