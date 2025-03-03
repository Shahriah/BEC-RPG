import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Info, ArrowLeft, Check, X, Trophy, Shield, AlertTriangle, Play } from 'lucide-react';
import InteractiveEmail from './InteractiveEmail';
import { EmailScenarios } from '../../data/emailScenarios';

const EmailGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = location.state?.roleId;
  const roleName = location.state?.roleName;

  // State Management
  const [startTime] = useState(Date.now());
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [analysisScore, setAnalysisScore] = useState(0);
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);



  // Get scenarios for the selected role
  const roleScenarios = EmailScenarios[roleId?.toUpperCase()] || [];
  const currentScenario = roleScenarios[currentScenarioIndex];

  useEffect(() => {
    if (!roleId) {
      navigate('/');
    }
  }, [roleId, navigate]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setShowFeedback(true);

    const totalScore = {
      analysis: analysisScore,
      response: option.points
    };

    const finalScore = Math.round((totalScore.analysis + totalScore.response) / 2);

    if (currentScenarioIndex === roleScenarios.length - 1) {
      // Handle final scenario completion
      try {
        const response = await fetch('http://localhost:5000/api/missions/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'testuser',
            missionId: 'email-urgency',
            score: finalScore,
            timeSpent: Date.now() - startTime
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setGameStats({
            analysisScore: totalScore.analysis,
            responseScore: totalScore.response,
            finalScore: finalScore,
            timeSpent: Date.now() - startTime,
            pointsEarned: data.pointsEarned,
            totalPoints: data.totalPoints,
            newRank: data.rank
          });
          setShowCompletionModal(true);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };
  const renderScoreFeedback = () => {
    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold mb-2">Your Performance</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Email Analysis:</span>
            <span>{analysisScore}%</span>
          </div>
          <div className="flex justify-between">
            <span>Response Choice:</span>
            <span>{selectedOption.points}%</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Overall Score:</span>
            <span>{Math.round((analysisScore + selectedOption.points) / 2)}%</span>
          </div>
        </div>
      </div>
    );
  };

  const handleNextScenario = () => {
    setCurrentScenarioIndex(prev => prev + 1);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowOptions(false);
    setAnalysisScore(0);
    setSelectedFlags([]); // Reset selected flags
  };

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
                <p>Analysis Score: {analysisScore}%</p>
                <p>Response Score: {gameStats.score}%</p>
                <p>Time: {Math.round(gameStats.timeSpent / 1000)}s</p>
                <p>Points Earned: {gameStats.pointsEarned}</p>
                <p>New Rank: {gameStats.newRank}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
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
  const renderTutorial = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Informative Content */}
          <div className="bg-blue-600 text-white p-8 flex flex-col justify-center">
            <div className="mb-6">
              <Mail className="w-16 h-16 text-white mb-4" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">Email Security Simulator</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Cybersecurity Challenge</h3>
                  <p className="text-sm text-blue-100">
                    Develop critical skills in identifying and mitigating Business Email Compromise (BEC) threats.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Real-World Scenarios</h3>
                  <p className="text-sm text-blue-100">
                    Experience authentic email security challenges from different organizational roles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Continuous Learning</h3>
                  <p className="text-sm text-blue-100">
                    Gain insights into email threat detection, social engineering, and security best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Role and Mission Details */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Your Mission: {roleName}</h3>
              <p className="text-gray-600 mb-4">
                As a {roleName}, you are tasked with identifying and responding to potential Business Email Compromise (BEC) threats.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Mission Objectives</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Analyze email content for suspicious elements</li>
                  <li>Identify social engineering tactics</li>
                  <li>Protect organizational communication channels</li>
                  <li>Make informed security decisions quickly</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2">Key Skills You'll Develop</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Threat detection</li>
                  <li>Critical email analysis</li>
                  <li>Incident response</li>
                  <li>Social engineering awareness</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Begin Email Security Investigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentScenario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </button>
        {showTutorial && renderTutorial()}

  
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold">Email Security Training</h1>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Role: {roleName}</p>
            <p className="text-sm text-gray-600">
              Scenario {currentScenarioIndex + 1} of {roleScenarios.length}
            </p>
          </div>
        </div>
  
        {/* Scenario Context */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h2 className="font-semibold mb-2">{currentScenario.title}</h2>
          <p className="text-gray-700">{currentScenario.context}</p>
        </div>
  
        {/* Learning Objectives */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-green-700" />
            Learning Objectives
          </h3>
          <ul className="space-y-1">
            {currentScenario.educationalPoints.map((point, index) => (
              <li key={index} className="text-sm text-green-800 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
  
        {/* Current Email Display - Always visible */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="font-mono text-sm border rounded p-4 mb-4">
            <div><strong>From:</strong> {currentScenario.initialSituation.from}</div>
            <div><strong>Subject:</strong> {currentScenario.initialSituation.subject}</div>
            <div><strong>Time:</strong> {currentScenario.initialSituation.timestamp}</div>
            <div className="mt-4 whitespace-pre-wrap">{currentScenario.initialSituation.content}</div>
          </div>
  
          {!showOptions ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Step 1: Identify the Red Flags
                </h2>
                <p className="text-sm text-gray-600">
                  Click on any suspicious elements in the email that could indicate a Business Email Compromise attempt.
                </p>
              </div>
  
              <InteractiveEmail
                email={currentScenario.initialSituation}
                onAnalysisComplete={(accuracy) => {
                  setAnalysisScore(accuracy);
                  setShowOptions(true);
                }}
              />
            </>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Step 2: Choose Your Response
                </h2>
                <p className="text-sm text-gray-600">
                  Based on your analysis, select the most appropriate response to this situation.
                </p>
              </div>
  
              <div className="space-y-2">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showFeedback}
                    className={`
                      w-full p-4 text-left rounded-lg border transition-colors
                      ${showFeedback && selectedOption === option
                        ? option.correct 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                        : 'hover:bg-gray-50 border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      {showFeedback && selectedOption === option && (
                        option.correct 
                          ? <Check className="w-5 h-5 text-green-600 mt-0.5" />
                          : <X className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <span>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Feedback Section */}
        {showFeedback && (
          <div className="space-y-4">
            {renderScoreFeedback()}
  
            <div className={`p-4 rounded-lg ${
              selectedOption.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="font-semibold mb-2">
                {selectedOption.correct ? 'Correct Response!' : 'Incorrect Response'}
              </div>
              <p className="text-gray-700">{selectedOption.feedback}</p>
            </div>
  
            {currentScenarioIndex < roleScenarios.length - 1 ? (
              <button
                onClick={handleNextScenario}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Scenario
              </button>
            ) : (
              <button
                onClick={() => setShowCompletionModal(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Mission
              </button>
            )}
          </div>
        )}
  
        {/* Completion Modal */}
        {renderCompletionModal()}
      </div>
    </div>
  );
};

export default EmailGame;