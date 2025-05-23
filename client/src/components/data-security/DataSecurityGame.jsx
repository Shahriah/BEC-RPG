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
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState({
    classification: '',
    access: '',
    security: ''
  });
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [gameStats, setGameStats] = useState(null);

  // deals with user's selections
  const handleChoice = (category, value) => {
    setSelectedChoices(prev => ({
      ...prev,
      [category]: value
    }));
  };
  // function to calculate users points dependent upon their answers
  const checkAnswers = async () => {
    const currentScen = scenarios[currentScenario];

    // finds number of corrcet responses
    const correctCount = Object.keys(selectedChoices).filter(
      key => selectedChoices[key] === currentScen.correctChoices[key]
    ).length;

    const pointsEarned = correctCount * 10;
    setScore(prev => prev + pointsEarned);

    //displays feedback
    setShowFeedback(true);


    // if the user has completed all the scenarios then the final score is calculated
    if (currentScenario === scenarios.length - 1) {
      const finalScore = Math.round(((score + pointsEarned) / (scenarios.length * 30)) * 100);
      const timeSpent = Date.now() - startTime;
      
      // send a complete request to backend to update the testuser's score
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

        // updates stats for entire game
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

  // moves to next scenario
  const handleNextScenario = () => {
    setCurrentScenario(prev => prev + 1);
    setSelectedChoices({
      classification: '',
      access: '',
      security: ''
    });
    setShowFeedback(false);
  };


  return (
    <div className="min-h-screen bg-slate-100 p-4 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto">
        {/* button to take you back to home */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </button>

        {/* header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
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

        {/* progress for scenarios */}
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

        {/* main area for game */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* current scenario */}
          <ScenarioCard scenario={scenarios[currentScenario]} />

          {/* selections */}
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
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                Submit Decisions
              </button>
            )}
          </div>

          {/* immediate feedback */}
          {showFeedback && (
            <FeedbackPanel
              choices={selectedChoices}
              correctChoices={scenarios[currentScenario].correctChoices}
              explanations={scenarios[currentScenario].explanation}
              securityTips={scenarios[currentScenario].securityTips}
              onNext={currentScenario < scenarios.length - 1 ? handleNextScenario : () => {
                setTimeout(() => setShowCompletionModal(true), 100);
              }}
            />
          )}
        </div>


        {/* screen to display completion */}
        {showCompletionModal && gameStats && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
             <div className="flex items-center gap-2 mb-4">
               <Trophy className="w-8 h-8 text-yellow-500" />
               <h2 className="text-2xl font-bold">Mission Complete!</h2>
             </div>
     
             <div className="bg-blue-50 p-4 rounded-lg">
               <h3 className="font-semibold text-lg mb-2">Your Results</h3>
               <div className="space-y-2">
                {/* shows game stats and calculates time spent */}
                 <p>Final Score: {gameStats.score}%</p>
                 <p>Time Spent: {Math.round(gameStats.timeSpent / 1000)}s</p>
                 <p>Points Earned: {gameStats.pointsEarned}</p>
                 <p>New Rank: {gameStats.newRank}</p>
               </div>
             </div>
     
             <div className="flex gap-2 mt-6">
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
        )}
      </div>
    </div>
  );
};

export default DataSecurityGame;