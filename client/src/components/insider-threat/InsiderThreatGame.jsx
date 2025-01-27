// src/components/games/InsiderThreatGame.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Trophy,
  AlertTriangle,
  Clock 
} from 'lucide-react';

import { scenarios } from '../../data/insiderThreatScenarios';
import ActivityCard from './InsiderActivityCard';
import RiskDashboard from './RiskDashboard';
import TeamInvestigationContainer from './TeamInvestigationContainer';
import RoleSpecificPanel from './RoleSpecificPanel';

const InsiderThreatGame = () => {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [analyzedActivities, setAnalyzedActivities] = useState(new Set());
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [gameState, setGameState] = useState({
    score: 0,
    currentRisk: 30,
    recentFlags: [],
    patterns: [],
    flaggedActivities: new Set(),
    investigationProgress: {},
    teamActions: []
  });
  
  const [showTutorial, setShowTutorial] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // Role selection handler
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  // Handle activity investigation
  const handleInvestigate = (activityId) => {
    const activity = scenarios[currentScenario].activities.find(a => a.id === activityId);
    setSelectedActivity(activity);
  };

  // Handle flagging suspicious activity
  const handleFlag = (activityId) => {
    const activity = scenarios[currentScenario].activities.find(a => a.id === activityId);
    
    if (activity && !gameState.flaggedActivities.has(activityId)) {
      setGameState(prev => ({
        ...prev,
        flaggedActivities: new Set([...prev.flaggedActivities, activityId])
      }));
    }
  };

  const handleActivityAnalyzed = (activityId, wasFlagged) => {
    const activity = scenarios[currentScenario].activities.find(a => a.id === activityId);
    
    // Update score based on correct/incorrect analysis
    const scoreChange = (activity.isSuspicious && wasFlagged) || 
                       (!activity.isSuspicious && !wasFlagged) 
                       ? 10 : -5;

    // Update risk level based on activity and decision
    const riskChange = activity.isSuspicious ? (wasFlagged ? -5 : 10) : (wasFlagged ? 5 : 0);
    const newRisk = Math.max(0, Math.min(100, gameState.currentRisk + riskChange));

    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreChange,
      currentRisk: newRisk,
      recentFlags: wasFlagged ? 
        [`${activity.employee}: ${activity.details}`, ...prev.recentFlags].slice(0, 5) :
        prev.recentFlags,
      patterns: activity.flags && wasFlagged ? 
        [...prev.patterns, ...activity.flags].slice(0, 5) : 
        prev.patterns
    }));

    setAnalyzedActivities(prev => new Set([...prev, activityId]));

    // Check if all activities in current scenario have been analyzed
    const allActivitiesAnalyzed = scenarios[currentScenario].activities
      .every(a => analyzedActivities.has(a.id) || a.id === activityId);

    if (allActivitiesAnalyzed) {
      setTimeout(handleScenarioComplete, 2000);
    }
  };

  // Handle investigation updates from team components
  const handleInvestigationUpdate = (update) => {
    switch (update.type) {
      case 'COMMUNICATION_ANALYZED':
        setGameState(prev => ({
          ...prev,
          score: prev.score + 5,
          investigationProgress: {
            ...prev.investigationProgress,
            [update.messageId]: true
          }
        }));
        break;

      case 'STAGE_COMPLETE':
        setGameState(prev => ({
          ...prev,
          score: prev.score + 10,
          investigationProgress: {
            ...prev.investigationProgress,
            [update.stageId]: true
          }
        }));
        break;

      case 'NOTE_ADDED':
        setGameState(prev => ({
          ...prev,
          score: prev.score + 5,
          teamActions: [...prev.teamActions, { type: 'note', ...update.note }]
        }));
        break;

      default:
        break;
    }
  };

  const handleScenarioComplete = () => {
    if (currentScenario === scenarios.length - 1) {
      handleGameComplete();
    } else {
      setCurrentScenario(prev => prev + 1);
      setGameState(prev => ({
        ...prev,
        flaggedActivities: new Set(),
        investigationProgress: {},
        currentRisk: 30,
      }));
      setSelectedActivity(null);
      setAnalyzedActivities(new Set());
    }
  };

  const handleGameComplete = async () => {
    const finalScore = Math.round((gameState.score / (scenarios.length * 50)) * 100);
    const timeSpent = Date.now() - startTime;

    try {
      const response = await fetch('http://localhost:5000/api/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          missionId: 'insider-threat',
          score: finalScore,
          timeSpent
        }),
      });

      const data = await response.json();
      setGameStats({
        score: finalScore,
        timeSpent,
        pointsEarned: data.pointsEarned,
        totalPoints: data.totalPoints,
        newRank: data.rank,
        investigationsCompleted: scenarios.length,
        threatsIdentified: Array.from(gameState.flaggedActivities).length,
        teamActionsPerformed: gameState.teamActions.length
      });
      setShowCompletionModal(true);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Tutorial Modal Component
  const renderTutorial = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Insider Threat Detection</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Mission:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Take on a security role in the organization</li>
              <li>Monitor suspicious communications and activities</li>
              <li>Analyze potential insider threats</li>
              <li>Follow proper investigation procedures</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Analysis of suspicious communications</li>
              <li>Risk assessment and monitoring</li>
              <li>Multi-stage investigation process</li>
              <li>Role-specific investigation tools</li>
            </ul>
          </div>
          <button
            onClick={() => setShowTutorial(false)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Mission
          </button>
        </div>
      </div>
    </div>
  );

  // Completion Modal Component
  const renderCompletionModal = () => {
    if (!showCompletionModal || !gameStats) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-2xl font-bold">Mission Complete!</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Your Results</h3>
              <div className="space-y-2">
                <p>Final Score: {gameStats.score}%</p>
                <p>Time: {Math.round(gameStats.timeSpent / 1000)}s</p>
                <p>Points Earned: {gameStats.pointsEarned}</p>
                <p>New Rank: {gameStats.newRank}</p>
                <p>Investigations Completed: {gameStats.investigationsCompleted}</p>
                <p>Threats Identified: {gameStats.threatsIdentified}</p>
                <p>Team Actions: {gameStats.teamActionsPerformed}</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Key Learning Points:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {scenarios.flatMap(s => s.learningPoints).map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Return to Missions
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Insider Threat Monitor</h1>
                <p className="text-sm text-gray-600">
                  {selectedRole ? `Role: ${selectedRole}` : 'Select your role to begin'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Score: {gameState.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-medium">
                  Scenario {currentScenario + 1}/{scenarios.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-3 gap-4">
          {/* Activity Feed and Investigation */}
          <div className="col-span-2 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h2 className="font-semibold mb-2">{scenarios[currentScenario].title}</h2>
              <p className="text-sm text-blue-800">
                {scenarios[currentScenario].description}
              </p>
            </div>

            {/* Activity Cards */}
            <div className="space-y-4">
              {scenarios[currentScenario].activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onInvestigate={handleInvestigate}
                  onFlag={handleFlag}
                  isInvestigated={selectedActivity?.id === activity.id}
                  isFlagged={gameState.flaggedActivities.has(activity.id)}
                  isAnalyzed={analyzedActivities.has(activity.id)}
                  onAnalyze={handleActivityAnalyzed}
                />
              ))}
            </div>

            {/* Team Investigation Container */}
            {selectedActivity && (
              <TeamInvestigationContainer
                currentRole={selectedRole}
                activity={selectedActivity}
                onInvestigationUpdate={handleInvestigationUpdate}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Risk Dashboard */}
            <RiskDashboard
              currentRisk={gameState.currentRisk}
              recentFlags={gameState.recentFlags}
              patterns={gameState.patterns}
            />

            {/* Role-Specific Actions */}
            {selectedRole && (
              <RoleSpecificPanel
                role={selectedRole}
                activity={selectedActivity}
                onAction={(actionId) => {
                  setGameState(prev => ({
                    ...prev,
                    score: prev.score + 5,
                    teamActions: [...prev.teamActions, { type: 'action', actionId }]
                  }));
                }}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        {showTutorial && renderTutorial()}
        {renderCompletionModal()}
      </div>
    </div>
  );
};

export default InsiderThreatGame;