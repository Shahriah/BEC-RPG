// src/__tests__/components/AchievementBanner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AchievementBanner from '../../components/AchievementBanner';

// Mock the lucide-react Trophy icon
jest.mock('lucide-react', () => ({
  Trophy: () => <div data-testid="trophy-icon">Trophy Icon</div>
}));

describe('AchievementBanner Component', () => {
  const defaultProps = {
    achieved: 3,
    total: 5
  };

  test('renders achievement banner with correct title', () => {
    render(<AchievementBanner {...defaultProps} />);
    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
  });

  test('displays achievement progress correctly', () => {
    render(<AchievementBanner {...defaultProps} />);
    expect(screen.getByText('3/5 Achievements')).toBeInTheDocument();
  });

  test('renders trophy icon', () => {
    render(<AchievementBanner {...defaultProps} />);
    expect(screen.getByTestId('trophy-icon')).toBeInTheDocument();
  });

  test('displays motivational message', () => {
    render(<AchievementBanner {...defaultProps} />);
    expect(screen.getByText('Complete all missions to become a Cyber Defense Master')).toBeInTheDocument();
  });

  test('handles zero achievements', () => {
    render(<AchievementBanner achieved={0} total={5} />);
    expect(screen.getByText('0/5 Achievements')).toBeInTheDocument();
  });

  test('handles full completion', () => {
    render(<AchievementBanner achieved={5} total={5} />);
    expect(screen.getByText('5/5 Achievements')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    const { container } = render(<AchievementBanner {...defaultProps} />);
    
    // Check for gradient background on the main container
    const banner = container.firstChild;
    expect(banner).toHaveClass(
      'bg-gradient-to-r',
      'from-yellow-50',
      'to-orange-50',
      'border',
      'border-yellow-300',
      'rounded-lg'
    );
    
    // Check trophy icon's parent container has flex classes
    const trophyContainer = screen.getByTestId('trophy-icon').parentElement;
    expect(trophyContainer).toHaveClass('flex', 'items-center', 'gap-3');

    // Check achievement counter styling
    const counter = screen.getByText('3/5 Achievements');
    expect(counter).toHaveClass('bg-yellow-100', 'text-yellow-700', 'rounded-full');
  });

  test('handles missing props with default values', () => {
    render(<AchievementBanner />);
    
    // Check if component renders without crashing
    expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
    
    // Check if it shows achievements counter with empty values
    const achievementsText = screen.getByText(/Achievements/);
    expect(achievementsText).toBeInTheDocument();
    
    // The parent div should contain "/"
    const parentDiv = achievementsText.parentElement;
    expect(parentDiv).toHaveTextContent('/');
  });
});