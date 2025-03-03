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

  const [startTime] = useState(Date.now());
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [score, setScore] = useState(0);
  const [investigatedActivities, setInvestigatedActivities] = useState(new Set());
  const [feedbackModal, setFeedbackModal] = useState(null);

  // Get scenarios for the selected role
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
      // Find the current scenario's activities
      const currentScenarioActivities = roleScenarios[currentScenario].activities;
      
      // Find the specific activity
      const activity = currentScenarioActivities.find(a => a.id === activityId);
      
      if (activity) {
        // Check if the activity has suspicious factors (based on timeline)
        const hasSuspiciousFactors = activity.timeline.some(item => !item.isNormal);
        const isCorrect = isSuspicious === hasSuspiciousFactors;
        
        const scoreChange = isCorrect ? 10 : -5;
        setScore(prev => prev + scoreChange);
        
        const newInvestigated = new Set(investigatedActivities).add(activityId);
        setInvestigatedActivities(newInvestigated);
  
        // Close the selected activity when showing feedback
        setSelectedActivity(null);
  
        // Check if all activities in current scenario are investigated
        const allInvestigated = currentScenarioActivities.every(a => 
          newInvestigated.has(a.id)
        );
        const feedback = getInsiderThreatFeedback(roleId.toUpperCase(), isCorrect);
        setFeedbackModal(feedback);
        
        if (allInvestigated) {
          setTimeout(async () => {
            if (currentScenario === roleScenarios.length - 1) {
              // Game complete
              try {
                const finalScore = Math.round((score / (roleScenarios.length * 20)) * 100);
                const response = await fetch('http://localhost:5000/api/missions/complete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
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
              // Move to next scenario
              setCurrentScenario(prev => prev + 1);
              setInvestigatedActivities(new Set());
            }
          }, 1000);
        }
      }
    }
  };

  const ActivityCard = ({ activity }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <activity.icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">{activity.employee}</h3>
            <p className="text-sm text-gray-600">{activity.department}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">{activity.timestamp}</span>
      </div>

      <p className="text-sm mb-4">{activity.details}</p>

      {!investigatedActivities.has(activity.id) ? (
        <div className="flex justify-between">
          <button
            onClick={() => handleInvestigate(activity)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Investigate
          </button>
          <div className="space-x-2">
            <button
              onClick={() => handleFlagActivity(activity.id, true)}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Flag Suspicious
            </button>
            <button
              onClick={() => handleFlagActivity(activity.id, false)}
              className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark Normal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Investigation complete</span>
          <Shield className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  const InvestigationPanel = () => {
    if (!selectedActivity) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedActivity.employee}</h2>
                <p className="text-sm text-gray-600">{selectedActivity.department}</p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <TimelineAnalysisView activity={selectedActivity} />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close Investigation
              </button>
              <button
                onClick={() => handleFlagActivity(selectedActivity.id, true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Flag as Suspicious
              </button>
              <button
                onClick={() => handleFlagActivity(selectedActivity.id, false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Normal
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
              <Users className="w-16 h-16 text-white mb-4" strokeWidth={1.5} />
              <h2 className="text-3xl font-bold mb-4">Insider Threat Simulator</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Cybersecurity Challenge</h3>
                  <p className="text-sm text-blue-100">
                    Develop critical skills in detecting and preventing insider threats.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Real-World Scenarios</h3>
                  <p className="text-sm text-blue-100">
                    Experience authentic insider threat scenarios from different organizational roles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Continuous Learning</h3>
                  <p className="text-sm text-blue-100">
                    Gain insights into threat detection, pattern recognition, and security best practices.
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
                As a {roleName}, you are tasked with monitoring and investigating potential insider threats within your organization.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <h4 className="font-semibold mb-2">Mission Objectives</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Analyze employee activity patterns</li>
                  <li>Identify suspicious behavioral changes</li>
                  <li>Protect organizational assets and information</li>
                  <li>Make informed security decisions quickly</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold mb-2">Key Skills You'll Develop</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>Pattern recognition</li>
                  <li>Contextual analysis</li>
                  <li>Risk assessment</li>
                  <li>Critical thinking under pressure</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Begin Insider Threat Investigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
                    Role: {roleName} - {roleScenarios[currentScenario].title}
                  </p>
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
  
          {/* Main Game Area */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h2 className="font-semibold mb-2">{roleScenarios[currentScenario].description}</h2>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Info className="w-4 h-4" />
                <p>Investigate patterns and identify suspicious behavior changes.</p>
              </div>
            </div>
  
            {roleScenarios[currentScenario].activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
  
          {/* Investigation Panel */}
          {selectedActivity && (
            <InvestigationPanel 
              activity={selectedActivity}
              onClose={() => setSelectedActivity(null)}
              onFlagActivity={handleFlagActivity}
              investigatedActivities={investigatedActivities}
            />
          )}
  
          {/* Tutorial Modal */}
          {showTutorial && renderTutorial()}
  
          {/* Completion Modal */}
          {showCompletionModal && (
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
                      <p>Final Score: {Math.round((score / (roleScenarios.length * 20)) * 100)}%</p>
                      <p>Time: {Math.round((Date.now() - startTime) / 1000)}s</p>
                    </div>
                  </div>
  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Key Pattern Recognition Skills:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Identifying behavioral changes over time</li>
                      <li>Analyzing activity patterns and context</li>
                      <li>Recognizing suspicious pattern combinations</li>
                      <li>Understanding normal vs. abnormal behavior</li>
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
  
      {/* Feedback Modal - Outside main container */}
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
                    