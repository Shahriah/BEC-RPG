// src/__tests__/components/ProgressCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressCard from '../../components/ProgressCard.jsx';

describe('ProgressCard Component', () => {
  test('renders mission progress title and points', () => {
    render(<ProgressCard progress={75.6} points={300} />);
    expect(screen.getByText('Mission Progress')).toBeInTheDocument();
    expect(screen.getByText('300 Points')).toBeInTheDocument();
  });

  test('renders progress bar with correct width style', () => {
    const progress = 50;
    const { container } = render(<ProgressCard progress={progress} points={200} />);
    // The inner progress bar is the div with bg-blue-600
    const progressBar = container.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle(`width: ${progress}%`);
  });

  test('displays rounded percentage of missions complete', () => {
    render(<ProgressCard progress={33.7} points={100} />);
    expect(screen.getByText('34% Missions Complete')).toBeInTheDocument();
  });

  test('displays points to next rank for low points', () => {
    // For points=300, getNextRank returns { rank: 'Trainee', threshold: 500 }
    // So message: (500 - 300 = 200 points to Trainee)
    render(<ProgressCard progress={80} points={300} />);
    expect(screen.getByText('200 points to Trainee')).toBeInTheDocument();
  });

  test('displays points to next rank for mid-range points', () => {
    // For points=800, points >= 500 and < 1500 so next rank is { rank: 'Defender', threshold: 1500 }
    // Message: (1500 - 800 = 700 points to Defender)
    render(<ProgressCard progress={60} points={800} />);
    expect(screen.getByText('700 points to Defender')).toBeInTheDocument();
  });

  test('does not display next rank message when maximum rank achieved', () => {
    // For points=5000, getNextRank returns { rank: 'Maximum Rank Achieved', threshold: null }
    // So the message should not be rendered.
    render(<ProgressCard progress={100} points={5000} />);
    expect(screen.queryByText(/points to Maximum Rank Achieved/)).toBeNull();
  });
});
