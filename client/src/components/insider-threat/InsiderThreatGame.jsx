import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Shield, 
  Trophy,
  AlertTriangle,
  X,
  Info, 
  Search,
  Check,
  Play
} from 'lucide-react';

import { InsiderScenarios } from '../../data/insiderThreatScenarios';
import TimelineAnalysisView from './TimelineAnalysisView';
import { getInsiderThreatFeedback } from '../../data/insiderThreatEducation';
import InsiderThreatFeedbackModal from './InsiderThreatFeedbackModal';

const InsiderThreatGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = location.state?.roleId;
  const roleName = location.state?.roleName;
  // set states for the game
  const [startTime] = useState(Date.now());
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [score, setScore] = useState(0);
  const [investigatedActivities, setInvestigatedActivities] = useState(new Set());
  const [feedbackModal, setFeedbackModal] = useState(null);

  // retrieve scenarios for the selected role
  const roleScenarios = InsiderScenarios[roleId?.toUpperCase()] || [];

  useEffect(() => {
    if (!roleId) {
      navigate('/');
    }
  }, [roleId, navigate]);

  const handleInvestigate = (activity) => {
    setSelectedActivity(activity);
  };

  const handleFlagActivity = async (activityId, isSuspicious) => {
    if (!investigatedActivities.has(activityId)) {
      // find the current scenario's activities
      const currentScenarioActivities = roleScenarios[currentScenario].activities;
      // find the specific activity
      const activity = currentScenarioActivities.find(a => a.id === activityId);
      if (activity) {
        // check if the activity has suspicious factors (based on timeline)
        const hasSuspiciousFactors = activity.timeline.some(item => !item.isNormal);
        const isCorrect = isSuspicious === hasSuspiciousFactors;
        const scoreChange = isCorrect ? 10 : -5;
        setScore(prev => prev + scoreChange);
        const newInvestigated = new Set(investigatedActivities).add(activityId);
        setInvestigatedActivities(newInvestigated);
  
        // close the selected activity when showing feedback
        setSelectedActivity(null);
  
        // check if all activities in current scenario are investigated
        const allInvestigated = currentScenarioActivities.every(a => newInvestigated.has(a.id));
        const feedback = getInsiderThreatFeedback(roleId.toUpperCase(), isCorrect);
        setFeedbackModal(feedback);
        
        if (allInvestigated) {
          setTimeout(async () => {
            if (currentScenario === roleScenarios.length - 1) {
              // game has been completed
              try {
                const finalScore = Math.round((score / (roleScenarios.length * 20)) * 100);
                await fetch('http://localhost:5000/api/missions/complete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: 'testuser',
                    missionId: 'insider-threat',
                    score: finalScore,
                    timeSpent: Date.now() - startTime
                  }),
                });
                setShowCompletionModal(true);
              } catch (error) {
                console.error('Error saving progress:', error);
              }
            } else {
              // progress to next scenario
              setCurrentScenario(prev => prev + 1);
              setInvestigatedActivities(new Set());
            }
          }, 1000);
        }
      }
    }
  };

  const ActivityCard = ({ activity }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <activity.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">{activity.employee}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{activity.department}</p>
          </div>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">{activity.timestamp}</span>
      </div>

      <p className="text-xs sm:text-sm mb-4">{activity.details}</p>

      {!investigatedActivities.has(activity.id) ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleInvestigate(activity)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Investigate
          </button>
          <div className="space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              onClick={() => handleFlagActivity(activity.id, true)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Flag Suspicious
            </button>
            <button
              onClick={() => handleFlagActivity(activity.id, false)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark Normal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>Investigation complete</span>
          <Shield className="w-4 h-4" />
        </div>
      )}
    </div>
  );
  // investigation panel for the selected activity
  const InvestigationPanel = () => {
    if (!selectedActivity) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold">{selectedActivity.employee}</h2>
                <p className="text-xs sm:text-sm text-gray-600">{selectedActivity.department}</p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TimelineAnalysisView activity={selectedActivity} />

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs sm:text-sm"
              >
                Close Investigation
              </button>
              <button
                onClick={() => handleFlagActivity(selectedActivity.id, true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm"
              >
                Flag as Suspicious
              </button>
              <button
                onClick={() => handleFlagActivity(selectedActivity.id, false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm"
              >
                Mark as Normal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };



  if (!roleScenarios || roleScenarios.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">No Scenarios Available</h2>
          <p className="text-gray-600 text-center mb-4">
            No scenarios are currently available for your role.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* return back to home */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Missions
          </button>
  
          {/* header */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">Insider Threat Monitor</h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Role: {roleName} - {roleScenarios[currentScenario].title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-xs sm:text-sm">Score: {score}</span>
              </div>
            </div>
          </div>
  
          {/* main game */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-4">
              <h2 className="font-semibold mb-2 text-xs sm:text-sm">{roleScenarios[currentScenario].description}</h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                <Info className="w-4 h-4" />
                <p>Investigate patterns and identify suspicious behavior changes.</p>
              </div>
            </div>
  
            {roleScenarios[currentScenario].activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
  
          {/* investigation panel */}
          {selectedActivity && (
            <InvestigationPanel 
              activity={selectedActivity}
              onClose={() => setSelectedActivity(null)}
              onFlagActivity={handleFlagActivity}
              investigatedActivities={investigatedActivities}
            />
          )}
  
  
          {/* show the completion information */}
          {showCompletionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-bold">Mission Complete!</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Your Results</h3>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm">Final Score: {Math.round((score / (roleScenarios.length * 20)) * 100)}%</p>
                      <p className="text-xs sm:text-sm">Time: {Math.round((Date.now() - startTime) / 1000)}s</p>
                    </div>
                  </div>
  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-xs sm:text-sm">Key Pattern Recognition Skills:</h3>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                      <li>Identifying behavioral changes over time</li>
                      <li>Analyzing activity patterns and context</li>
                      <li>Recognizing suspicious pattern combinations</li>
                      <li>Understanding normal vs. abnormal behavior</li>
                    </ul>
                  </div>
  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      Return to Missions
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-xs sm:text-sm"
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
  
      {feedbackModal && (
        <InsiderThreatFeedbackModal 
          feedback={feedbackModal} 
          onClose={() => setFeedbackModal(null)} 
        />
      )}
    </>
  );
};

export default InsiderThreatGame;
