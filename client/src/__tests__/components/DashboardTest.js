import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';

// Updated mocks as plain functional components

jest.mock('../../components/Header', () => {
  return function Header({ completedMissions, totalMissions, rank }) {
    return (
      <div data-testid="header">
        Header: {completedMissions}/{totalMissions} - {rank}
      </div>
    );
  };
});

jest.mock('../../components/ProgressCard', () => {
  return function ProgressCard({ progress, points }) {
    return (
      <div data-testid="progress-card">
        Progress: {progress}% - Points: {points}
      </div>
    );
  };
});

jest.mock('../../components/MissionCard', () => {
  return function MissionCard({ mission, onStart, selectedRole }) {
    return (
      <div data-testid={`mission-card-${mission.id}`} onClick={onStart}>
        {mission.title} - {mission.locked ? 'Locked' : 'Unlocked'}
        {selectedRole && <span>Role Selected</span>}
      </div>
    );
  };
});

jest.mock('../../components/AchievementBanner', () => {
  return function AchievementBanner({ achieved, total }) {
    return (
      <div data-testid="achievement-banner">
        Achievements: {achieved}/{total}
      </div>
    );
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Mail: () => <div>Icon</div>,
  Users: () => <div>Icon</div>,
  Building2: () => <div>Icon</div>,
  Shield: () => <div>Icon</div>,
  ScrollText: () => <div>Icon</div>,
}));

jest.mock('../../types/roleTypes', () => ({
  Roles: [
    {
      id: 'ceo',
      title: 'Chief Executive Officer',
      description: 'Lead company security strategy',
      icon: () => <div>Icon</div>,
      responsibilities: ['Approve security policies']
    },
    {
      id: 'cto',
      title: 'Chief Technology Officer',
      description: 'Oversee technological strategy',
      icon: () => <div>Icon</div>,
      responsibilities: ['Manage tech infrastructure']
    }
  ]
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('Dashboard Component', () => {
  const defaultUserData = {
    totalPoints: 100,
    rank: 'Rookie',
    missions: [],
    achievements: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default fetch mock returns defaultUserData
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(defaultUserData)
      })
    );
    
    localStorageMock.getItem.mockReturnValue(null);
    window.alert = jest.fn();
  });

  const renderDashboard = () =>
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

  test('renders loading state', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders dashboard layout after loading', async () => {
    await act(async () => {
      renderDashboard();
    });
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Select Role')).toBeInTheDocument();
  });

  test('handles role selection and persists in localStorage', async () => {
    await act(async () => {
      renderDashboard();
    });
    const ceoButton = await screen.findByText('Chief Executive Officer');
    await act(async () => {
      fireEvent.click(ceoButton);
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'selectedRole', 
      expect.stringContaining('Chief Executive Officer')
    );
    expect(screen.getByText('Approve security policies')).toBeInTheDocument();
  });

  test('restores previously selected role from localStorage', async () => {
    const savedRole = JSON.stringify({
      id: 'cto',
      title: 'Chief Technology Officer',
      description: 'Oversee technological strategy',
      responsibilities: ['Manage tech infrastructure']
    });
    localStorageMock.getItem.mockReturnValue(savedRole);
    await act(async () => {
      renderDashboard();
    });
    expect(screen.getByText('Manage tech infrastructure')).toBeInTheDocument();
  });

  test('shows role selection warning when no role selected', async () => {
    await act(async () => {
      renderDashboard();
    });
    expect(screen.getByText('Please select a role to start missions')).toBeInTheDocument();
  });

  test('prevents mission start without role selection', async () => {
    const originalAlert = window.alert;
    await act(async () => {
      renderDashboard();
    });
    const missionCard = await screen.findByTestId('mission-card-email-urgency');
    await act(async () => {
      fireEvent.click(missionCard);
    });
    expect(window.alert).toHaveBeenCalledWith('Please select a role before starting a mission');
    expect(mockNavigate).not.toHaveBeenCalled();
    window.alert = originalAlert;
  });

  test('navigates to mission path when role is selected', async () => {
    await act(async () => {
      renderDashboard();
    });
    const ceoButton = await screen.findByText('Chief Executive Officer');
    await act(async () => {
      fireEvent.click(ceoButton);
    });
    const missionCard = await screen.findByTestId('mission-card-email-urgency');
    await act(async () => {
      fireEvent.click(missionCard);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/game/email', {
      state: {
        roleId: 'ceo',
        roleName: 'Chief Executive Officer'
      }
    });
  });

  test('handles failed user data fetch', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ ok: false }))
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            totalPoints: 0,
            rank: 'Rookie',
            missions: [],
            achievements: []
          })
        })
      );
    await act(async () => {
      renderDashboard();
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/testuser');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/users',
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
        body: expect.any(String)
      })
    );
  });

  test('renders all mission cards', async () => {
    await act(async () => {
      renderDashboard();
    });
    expect(screen.getByTestId('mission-card-email-urgency')).toBeInTheDocument();
    expect(screen.getByTestId('mission-card-insider-threat')).toBeInTheDocument();
    expect(screen.getByTestId('mission-card-bec-security')).toBeInTheDocument();
    expect(screen.getByTestId('mission-card-data-security')).toBeInTheDocument();
  });

  test('renders achievement banner', async () => {
    await act(async () => {
      renderDashboard();
    });
    expect(screen.getByTestId('achievement-banner')).toBeInTheDocument();
  });

  test('renders progress card with correct data', async () => {
    await act(async () => {
      renderDashboard();
    });
    const progressCard = await screen.findByTestId('progress-card');
    expect(progressCard).toBeInTheDocument();
    expect(progressCard).toHaveTextContent('Progress: 0% - Points: 100');
  });

  // ---- New tests to cover remaining lines ----

  test('unlocks "insider-threat" mission when "email-urgency" is completed', async () => {
    const userDataWithEmailCompleted = {
      totalPoints: 100,
      rank: 'Rookie',
      missions: [
        { missionId: 'email-urgency', completed: true, score: 10 }
      ],
      achievements: []
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userDataWithEmailCompleted)
      })
    );
    await act(async () => {
      renderDashboard();
    });
    const insiderThreatCard = screen.getByTestId('mission-card-insider-threat');
    // The MissionCard mock displays "Locked" if mission.locked is true and "Unlocked" otherwise.
    expect(insiderThreatCard).toHaveTextContent('Unlocked');
  });

  test('unlocks "data-security" mission when "bec-security" is completed', async () => {
    const userDataWithPrerequisitesCompleted = {
      totalPoints: 100,
      rank: 'Rookie',
      missions: [
        { missionId: 'email-urgency', completed: true, score: 10 },
        { missionId: 'insider-threat', completed: true, score: 20 },
        { missionId: 'bec-security', completed: true, score: 30 }
      ],
      achievements: []
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userDataWithPrerequisitesCompleted)
      })
    );
    await act(async () => {
      renderDashboard();
    });
    const dataSecurityCard = screen.getByTestId('mission-card-data-security');
    expect(dataSecurityCard).toHaveTextContent('Unlocked');
  });

  test('handles fetch rejection gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    await act(async () => {
      renderDashboard();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user data:', expect.any(Error));
    // Ensure that the component is no longer in the loading state (i.e. main UI is rendered)
    expect(screen.getByText('Select Role')).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
