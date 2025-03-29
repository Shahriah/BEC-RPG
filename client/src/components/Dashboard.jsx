import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ProgressCard from './ProgressCard';
import MissionCard from './MissionCard';
import AchievementBanner from './AchievementBanner';
import { Mail, Users, Shield, ScrollText } from 'lucide-react';
import { Roles } from '../types/roleTypes';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        totalPoints: 0,
        rank: 'Rookie',
        missions: [],
        achievements: []
    });
    const [selectedRole, setSelectedRole] = useState(() => {
        const savedRole = localStorage.getItem('selectedRole');
        return savedRole ? JSON.parse(savedRole) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const missions = [
        { 
          id: 'email-urgency',
          title: "Mission 1: Email Urgency Detection", 
          description: "Master the art of spotting urgent email traps and identifying phishing attempts",
          icon: Mail, 
          completed: userData.missions?.some(m => m.missionId === 'email-urgency' && m.completed) || false,
          score: userData.missions?.find(m => m.missionId === 'email-urgency')?.score || 0,
          achievement: "Speed Detective",
          difficulty: "Beginner",
          path: "/game/email",
          locked: false
        },
        { 
          id: 'insider-threat',
          title: "Mission 2: Insider Threat Detection", 
          description: "Learn to identify suspicious behavior patterns and protect against internal security risks",
          icon: Users, 
          completed: userData.missions?.some(m => m.missionId === 'insider-threat' && m.completed) || false,
          score: userData.missions?.find(m => m.missionId === 'insider-threat')?.score || 0,
          achievement: "Behavior Guardian",
          difficulty: "Intermediate",
          path: "/game/insider-threat",
          locked: !userData.missions?.some(m => m.missionId === 'email-urgency' && m.completed)
        },
        {
            id: 'bec-security',
            title: "Mission 3: Business Email Security",
            description: "Learn to protect against Business Email Compromise (BEC) attacks and validate business communications",
            icon: ScrollText,
            completed: userData.missions?.some(m => m.missionId === 'bec-security' && m.completed) || false,
            score: userData.missions?.find(m => m.missionId === 'bec-security')?.score || 0,
            achievement: "Email Guardian",
            difficulty: "Advanced",
            path: "/game/bec-security",
            locked: !userData.missions?.some(m => m.missionId === 'insider-threat' && m.completed)
        },
        {
          id: 'data-security',
          title: "Mission 4: Data Security Protocol",
          description: "Learn to protect sensitive company information from social engineering attacks",
          icon: Shield,
          completed: userData.missions?.some(m => m.missionId === 'data-security' && m.completed) || false,
          score: userData.missions?.find(m => m.missionId === 'data-security')?.score || 0,
          achievement: "Data Defender",
          difficulty: "Expert",
          path: "/game/data-security",
          locked: !userData.missions?.some(m => m.missionId === 'bec-security' && m.completed)
        }
    ];

    // fetch user data and set up temporary user for game
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/testuser');
                // successful user obtained
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    // Create new user if doesn't exist
                    const createResponse = await fetch('http://localhost:5000/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username: 'testuser' })
                    });
                    const newUser = await createResponse.json();
                    setUserData(newUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                // finish loading screen 
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // adjust selected role using localStorage which keeps track of currently selected role
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        if (role) {
            localStorage.setItem('selectedRole', JSON.stringify(role));
        } else {
            localStorage.removeItem('selectedRole');
        }
    };
    
    // display loading screen
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    const completedMissions = missions.filter(m => m.completed).length;

    return (
        <div className="min-h-screen bg-slate-100">
            <Header
                completedMissions={completedMissions}
                totalMissions={missions.length}
                rank={userData.rank}
            />

            <div className="flex">
                {/* side panel */}
                <div className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Select Role</h2>
                        <p className="text-sm text-gray-600">Choose your perspective</p>
                    </div>

                    <div className="space-y-2">
                        {Roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role)}
                                    className={`
                                        w-full p-3 rounded-lg text-left transition-all duration-200
                                        ${selectedRole?.id === role.id
                                            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
                                            : 'bg-white border border-gray-200 hover:border-blue-300 text-gray-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${selectedRole?.id === role.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{role.title}</div>
                                            <div className="text-xs text-gray-500">{role.description}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {selectedRole && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">Responsibilities:</h3>
                            <ul className="text-xs text-blue-800 space-y-1">
                                {selectedRole.responsibilities.map((resp, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!selectedRole && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-700">
                                Please select a role to start missions
                            </p>
                        </div>
                    )}
                </div>

                {/* main content */}
                <main className="flex-1 p-4 space-y-6">
                    <ProgressCard
                        progress={(completedMissions / missions.length) * 100}
                        points={userData.totalPoints}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {missions.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                selectedRole={selectedRole}
                                onStart={() => {
                                    if (!selectedRole) {
                                        alert('Please select a role before starting a mission');
                                        return;
                                    }
                                    navigate(mission.path, {
                                        state: {
                                            roleId: selectedRole.id,
                                            roleName: selectedRole.title
                                        }
                                    });
                                }}
                            />
                        ))}
                    </div>

                    {/* achievement banner */}
                    <AchievementBanner
                        achieved={userData.achievements?.length || 0}
                        total={5}
                        rank={userData.rank}
                    />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
