
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MissionCard from '../../components/MissionCard.jsx';


const DummyIcon = () => <div data-testid="dummy-icon">Icon</div>;

describe('MissionCard Component', () => {
  
  const baseMission = {
    title: "Test Mission",
    description: "Test Description",
    icon: DummyIcon,
    completed: false,
    score: 0,
    achievement: null,
    difficulty: "Beginner",
    locked: false,
  };

  test('renders mission card with title, description and difficulty', () => {
    render(<MissionCard mission={baseMission} onStart={jest.fn()} />);
    expect(screen.getByText("Test Mission")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Beginner")).toBeInTheDocument();
    
    expect(screen.getByRole('button')).toHaveTextContent("Start Mission");
  });

  test('calls onStart when Start Mission button is clicked (unlocked, not completed)', () => {
    const onStartMock = jest.fn();
    render(<MissionCard mission={baseMission} onStart={onStartMock} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onStartMock).toHaveBeenCalled();
  });

  test('renders locked state with no selected role: button text "Select Role to Unlock" and disabled', () => {
    const lockedMission = { ...baseMission, locked: true };
    render(<MissionCard mission={lockedMission} onStart={jest.fn()} selectedRole={null} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Select Role to Unlock");
  });
  

  test('renders locked state with selected role: button text "Complete Previous Mission" and disabled', () => {
    const lockedMission = { ...baseMission, locked: true };
    const selectedRole = { id: 'ceo', title: 'Chief Executive Officer' };
    render(<MissionCard mission={lockedMission} onStart={jest.fn()} selectedRole={selectedRole} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Complete Previous Mission");
  });

  test('renders completed state: displays score and button text "Mission Complete"', () => {
    const completedMission = { ...baseMission, completed: true, score: 80, locked: false };
    render(<MissionCard mission={completedMission} onStart={jest.fn()} />);
    
    expect(screen.getByText("80%")).toBeInTheDocument();
    
    expect(screen.getByRole('button')).toHaveTextContent("Mission Complete");
  });

  test('renders achievement if provided', () => {
    const missionWithAchievement = { ...baseMission, achievement: "Star Performer" };
    render(<MissionCard mission={missionWithAchievement} onStart={jest.fn()} />);
    expect(screen.getByText("Star Performer")).toBeInTheDocument();
  });
});
