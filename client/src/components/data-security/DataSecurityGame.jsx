// components/games/DataSecurityGame.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield,
  Lock,
  Users,
  Key,
  Trophy,
  Play
} from 'lucide-react';

import { scenarios } from '../../data/dataSecurityScenarios';
import { DataClassification, AccessLevels, SecurityMeasures } from '../../types/dataSecurityTypes';
import { ScenarioCard, ChoiceSelector, FeedbackPanel } from './DataSecurityScenarioCard';

const DataSecurityGame = () => {
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState({
    classification: '',
    access: '',
    security: ''
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  const handleChoice = (category, value) => {
    setSelectedChoices(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const checkAnswers = async () => {
    const currentScen = scenarios[currentScenario];
    const correctCount = Object.keys(selectedChoices).filter(
      key => selectedChoices[key] === currentScen.correctChoices[key]
    ).length;

    const pointsEarned = correctCount * 10;
    setScore(prev => prev + pointsEarned);
    setShowFeedback(true);

    if (currentScenario === scenarios.length - 1) {
      const finalScore = Math.round(((score + pointsEarned) / (scenarios.length * 30)) * 100);
      const timeSpent = Date.now() - startTime;

      try {
        const response = await fetch('http://localhost:5000/api/missions/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'testuser',
            missionId: 'data-security',
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
          newRank: data.rank
        });
        setShowCompletionModal(true);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const handleNextScenario = () => {
    setCurrentScenario(prev => prev + 1);
    setSelectedChoices({
      classification: '',
      access: '',
      security: ''
    });
    setShowFeedback(false);
  };

  // Tutorial Modal
  const renderTutorial = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Informative Content */}
          <div className="bg-blue-600 text-white p-8 flex flex-col justify-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 text-white mb-4" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">Data Guardian</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Data Protection Challenge</h3>
                  <p className="text-sm text-blue-100">
                    Develop critical skills in classifying, protecting, and managing sensitive organizational data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Real-World Scenarios</h3>
                  <p className="text-sm text-blue-100">
                    Experience authentic data security challenges across different organizational contexts.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Key className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Continuous Learning</h3>
                  <p className="text-sm text-blue-100">
                    Gain insights into data classification, access control, and security best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Mission Details */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Your Mission</h3>
              <p className="text-gray-600 mb-4">
                Navigate complex data security scenarios to protect your organization's most valuable asset: information.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Mission Objectives</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Classify sensitive company data correctly</li>
                  <li>Determine appropriate access levels</li>
                  <li>Choose proper security measures</li>
                  <li>Protect company information assets</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2">Key Skills You'll Develop</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Data classification techniques</li>
                  <li>Access control principles</li>
                  <li>Security risk assessment</li>
                  <li>Compliance and protection strategies</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Begin Data Security Investigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
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
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Data Guardian</h1>
                <p className="text-sm text-gray-600">Protect company data assets</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium">
              {currentScenario + 1} / {scenarios.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Scenario */}
          <ScenarioCard scenario={scenarios[currentScenario]} />

          {/* Choices */}
          <div className="mt-6">
            <ChoiceSelector
              title="Data Classification"
              icon={Lock}
              options={DataClassification}
              selected={selectedChoices.classification}
              onChange={(value) => handleChoice('classification', value)}
              disabled={showFeedback}
            />

            <ChoiceSelector
              title="Access Level"
              icon={Users}
              options={AccessLevels}
              selected={selectedChoices.access}
              onChange={(value) => handleChoice('access', value)}
              disabled={showFeedback}
            />

            <ChoiceSelector
              title="Security Measures"
              icon={Key}
              options={SecurityMeasures}
              selected={selectedChoices.security}
              onChange={(value) => handleChoice('security', value)}
              disabled={showFeedback}
            />

            {!showFeedback && (
              <button
                onClick={checkAnswers}
                disabled={!selectedChoices.classification || !selectedChoices.access || !selectedChoices.security}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Decisions
              </button>
            )}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <FeedbackPanel
              choices={selectedChoices}
              correctChoices={scenarios[currentScenario].correctChoices}
              explanations={scenarios[currentScenario].explanation}
              securityTips={scenarios[currentScenario].securityTips}
              onNext={currentScenario < scenarios.length - 1 ? handleNextScenario : () => setShowCompletionModal(true)}
            />
          )}
        </div>

        {/* Tutorial Modal */}
        {showTutorial && renderTutorial()}

        {/* Completion Modal */}
        {showCompletionModal && gameStats && (
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
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Key Learning Points:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Proper data classification is crucial for security</li>
                    <li>Access controls should follow least privilege principle</li>
                    <li>Security measures must match data sensitivity</li>
                    <li>Consider both internal and external sharing requirements</li>
                    <li>Always follow established security protocols</li>
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
        )}
      </div>
    </div>
  );
};

export default DataSecurityGame;