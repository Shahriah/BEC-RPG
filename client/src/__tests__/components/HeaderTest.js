// tests/components/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  const defaultProps = {
    completedMissions: 0,
    totalMissions: 5,
    rank: 'Rookie'
  };

  test('renders header with title', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Cyber Defense Training')).toBeInTheDocument();
  });

  test('displays mission progress', () => {
    const props = {
      ...defaultProps,
      completedMissions: 3,
      totalMissions: 5
    };
    render(<Header {...props} />);
    expect(screen.getByText('3/5 Missions Complete')).toBeInTheDocument();
  });

  test('displays rank', () => {
    const props = {
      ...defaultProps,
      rank: 'Expert'
    };
    render(<Header {...props} />);
    expect(screen.getByText('Current Rank: Expert')).toBeInTheDocument();
  });

  test('renders with zero progress', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('0/5 Missions Complete')).toBeInTheDocument();
  });
});