import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle,
  Play,
  ArrowLeft, 
  Mail,
  Shield,
  Trophy,
  Info,
  AlertCircle
} from 'lucide-react';

import { scenarios } from '../../data/becSecurityScenarios';
import { EmailType, VerificationGameType } from '../../types/becSecurityTypes';
import { EmailViewer, ActionPanel, FeedbackPanel } from './BecEmailViewer';
import MiniGameManager from './MiniGameManager';

const BECSecurityGame = () => {

  // set game states
  const navigate = useNavigate();
  const [startTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [verificationScores, setVerificationScores] = useState({});
  const [gamePhase, setGamePhase] = useState('verification');
  const [gameStats, setGameStats] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleGameComplete = async (finalScore) => {
    try {
      // save the final score after submitting to backend
      const response = await fetch('http://localhost:5000/api/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          missionId: 'bec-security',
          score: finalScore,
          timeSpent: Date.now() - startTime
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGameStats({
          score: finalScore,
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
  };

  const handleVerificationComplete = async (stepType, stepScore) => {
    // update scores
    const newScores = {
      ...verificationScores,
      [stepType]: stepScore
    };
    setVerificationScores(newScores);
    
    // check if this was the final verification game (ContactSupervisor)
    if (stepType === VerificationGameType.CONTACT_SUPERVISOR) {
      // calculate overall verification score
      let verificationPoints = Object.values(newScores).reduce((sum, score) => sum + score, 0);
      let finalScore = Math.round(verificationPoints / 3); // Average of 3 games
      
      try {
        const response = await fetch('http://localhost:5000/api/missions/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'testuser',
            missionId: 'bec-security',
            score: finalScore,
            timeSpent: Date.now() - startTime
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          setGameStats({
            score: finalScore,
            timeSpent: Date.now() - startTime,
            pointsEarned: data.pointsEarned,
            totalPoints: data.totalPoints,
            newRank: data.rank
          });
          setScore(finalScore);
          
          // move to the next game phase
          setGamePhase('action');
          
          // optionally, show the completion modal
          setShowCompletionModal(true);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };
  const handleAction = async (action) => {
    const currentEmail = scenarios[0];
    const isFraud = currentEmail.type === EmailType.FRAUD;
    const correctAction = isFraud ? 'flag' : 'process';
    const isCorrect = action === correctAction;

    let verificationPoints = Object.values(verificationScores).reduce((sum, score) => sum + score, 0);
    let averageVerificationScore = verificationPoints / currentEmail.correctVerification.length;
    let actionPoints = isCorrect ? 100 : 0;
    
    let finalScore = Math.round((averageVerificationScore * 0.7) + (actionPoints * 0.3));
    setScore(finalScore);
    setShowFeedback(true);

    try {
      const response = await fetch('http://localhost:5000/api/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          missionId: 'bec-security',
          score: finalScore,
          timeSpent: Date.now() - startTime
        }),
      });

      const data = await response.json();
      setGameStats({
        score: finalScore,
        timeSpent: Date.now() - startTime,
        pointsEarned: data.pointsEarned,
        totalPoints: data.totalPoints,
        newRank: data.newRank
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const renderSecurityInsights = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Business Email Compromise (BEC) Security Insights</h2>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              Common BEC Attack Types
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Impersonation:</strong> Attackers pose as trusted executives or vendors</li>
              <li><strong>Fake Invoice Scams:</strong> Fraudulent payment requests that look legitimate</li>
              <li><strong>Vendor Email Compromise:</strong> Compromising supplier email accounts</li>
              <li><strong>CEO Fraud:</strong> Impersonating high-level executives to authorize transfers</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Prevention Strategies
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>Verify Independently:</strong> Always confirm unusual requests through alternative channels</li>
              <li><strong>Multi-Factor Authentication:</strong> Protect email and financial systems</li>
              <li><strong>Email Authentication:</strong> Use SPF, DKIM, and DMARC to prevent spoofing</li>
              <li><strong>Clear Approval Workflows:</strong> Establish multi-person verification for transactions</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Red Flags to Watch
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Urgent requests with pressure to act quickly</li>
              <li>Slight variations in email addresses or domain names</li>
              <li>Requests for confidentiality or bypassing procedures</li>
              <li>Unexpected changes in payment details or processes</li>
              <li>Emails with poor grammar or unusual formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">BEC Security Training</h1>
                <p className="text-sm text-gray-600">Identify and handle suspicious emails</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Score: {score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <EmailViewer 
              email={scenarios[0]}
              showRedFlags={showFeedback}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {gamePhase === 'verification' && (
              <MiniGameManager
                email={scenarios[0]}
                onComplete={handleVerificationComplete}
              />
            )}
            {gamePhase === 'feedback' && showFeedback && (
            <FeedbackPanel
              email={scenarios[0]}
              verificationSteps={Object.keys(verificationScores)}
              expectedSteps={scenarios[0].correctVerification}
              isCorrect={scenarios[0].type === EmailType.FRAUD}
              onContinue={() => {
                setShowCompletionModal(true);
                setGamePhase('complete');
              }}
            />
          )}
            {gamePhase === 'action'  && (
              <ActionPanel
                onAction={handleAction}
                verificationSteps={Object.keys(verificationScores)}
              />
            )}
          </div>
        </div>


        {showCompletionModal && gameStats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
                    {scenarios[0].learningPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                {renderSecurityInsights()}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/dashboard')}
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

export default BECSecurityGame;