import React from 'react';
import { render, screen } from '@testing-library/react';
import AchievementBanner from '../../components/AchievementBanner';

jest.mock('lucide-react', () => ({
  Trophy: () => <div data-testid="trophy-icon">Trophy Icon</div>
}));

describe('AchievementBanner Component', () => {
  // set default values
  const defaultProps = {
    achieved: 3,
    total: 5
  };

  test('renders achievement banner with correct title', () => {
    render(<AchievementBanner {...defaultProps} />);
    // The component now displays the current rank with a default value of "Rookie"
    expect(screen.getByText('Current Rank: Rookie')).toBeInTheDocument();
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
    expect(
      screen.getByText('Complete all missions to become a Cyber Defense Master')
    ).toBeInTheDocument();
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
    
    const banner = container.firstChild;
    // check for the background gradient, border, and rounded corners
    expect(banner).toHaveClass(
      'bg-gradient-to-r',
      'from-yellow-50',
      'to-orange-50',
      'border',
      'border-yellow-300',
      'rounded-lg'
    );
    
    // check for the trophy icon's container having the expected flex classes
    const trophyContainer = screen.getByTestId('trophy-icon').parentElement;
    expect(trophyContainer).toHaveClass('flex', 'items-center', 'gap-3');
    
    const counter = screen.getByText('3/5 Achievements');
    expect(counter).toHaveClass('bg-yellow-100', 'text-yellow-700', 'rounded-full');
  });

  test('handles missing props with default values', () => {
    render(<AchievementBanner />);
    
    // with missing props, rank defaults to Rookie
    expect(screen.getByText('Current Rank: Rookie')).toBeInTheDocument();
    
    const achievementsText = screen.getByText(/Achievements/);
    expect(achievementsText).toBeInTheDocument();
    
    // even when achieved and total are missing, the achievements element's text contains a "/"
    const parentDiv = achievementsText.parentElement;
    expect(parentDiv).toHaveTextContent('/');
  });
});
