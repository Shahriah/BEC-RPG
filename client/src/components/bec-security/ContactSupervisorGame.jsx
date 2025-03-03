import React, { useState, useEffect } from 'react';
import { Phone, Clock, CheckCircle, XCircle, AlertCircle, MessageCircle, Mail } from 'lucide-react';
import { VerificationGameType } from '../../types/becSecurityTypes';

const ContactSupervisorGame = ({ email, onComplete }) => {
 const [gameState, setGameState] = useState({
   showTutorial: true,
   currentStep: 0,
   selectedOptions: [],
   timeRemaining: 45,
   isComplete: false,
   score: 0,
   stepScores: [],
   stepSelections: [],
   showStepFeedback: false,
   showFinalFeedback: false
 });

 const communicationSteps = [
   {
     id: 'identify-concerns',
     question: "What are the key concerns to report?",
     options: [
       {
         id: 'urgent-pressure',
         text: "Unusual urgency and pressure tactics",
         correct: true,
         explanation: "Pressure tactics are common in fraud attempts"
       },
       {
         id: 'amount',
         text: "Large financial transaction request",
         correct: true,
         explanation: "Unusual financial requests require extra scrutiny"
       },
       {
         id: 'office-location',
         text: "Sender's office location",
         correct: false,
         explanation: "Not relevant to the security concern"
       },
       {
         id: 'verification',
         text: "Limited verification channels",
         correct: true,
         explanation: "Restricting verification is a red flag"
       }
     ]
   },
   {
     id: 'communication-channel',
     question: "How should you contact your supervisor?",
     options: [
       {
         id: 'reply-email',
         text: "Reply to the suspicious email",
         correct: false,
         explanation: "Never use suspicious email chains for verification"
       },
       {
         id: 'direct-call',
         text: "Call their official phone number",
         correct: true,
         explanation: "Official phone numbers are secure verification channels"
       },
       {
         id: 'team-chat',
         text: "Message on team chat platform",
         correct: false,
         explanation: "Not secure enough for sensitive security issues"
       },
       {
         id: 'in-person',
         text: "Walk to their office if possible",
         correct: true,
         explanation: "Face-to-face communication is most secure"
       }
     ]
   },
   {
     id: 'information-share',
     question: "What information should you share?",
     options: [
       {
         id: 'email-details',
         text: "Forward the suspicious email",
         correct: true,
         explanation: "Provides evidence for investigation"
       },
       {
         id: 'red-flags',
         text: "Identified security red flags",
         correct: true,
         explanation: "Helps in threat assessment"
       },
       {
         id: 'action-taken',
         text: "Actions you've already taken",
         correct: true,
         explanation: "Important for response coordination"
       },
       {
         id: 'personal-opinion',
         text: "Your personal opinions",
         correct: false,
         explanation: "Stick to objective facts and observations"
       }
     ]
   }
 ];

 useEffect(() => {
   if (!gameState.showTutorial && !gameState.isComplete && gameState.timeRemaining > 0) {
     const timer = setInterval(() => {
       setGameState(prev => ({
         ...prev,
         timeRemaining: prev.timeRemaining - 1
       }));
     }, 1000);

     return () => clearInterval(timer);
   }
 }, [gameState.showTutorial, gameState.isComplete, gameState.timeRemaining]);

 useEffect(() => {
   if (gameState.timeRemaining === 0) {
     handleSubmit();
   }
 }, [gameState.timeRemaining]);

 const handleOptionSelect = (optionId) => {
   setGameState(prev => {
     const newSelected = prev.selectedOptions.includes(optionId)
       ? prev.selectedOptions.filter(id => id !== optionId)
       : [...prev.selectedOptions, optionId];
     return {
       ...prev,
       selectedOptions: newSelected
     };
   });
 };

 const handleContinue = () => {
   if (gameState.currentStep < communicationSteps.length - 1) {
     setGameState(prev => ({
       ...prev,
       currentStep: prev.currentStep + 1,
       selectedOptions: [],
       showStepFeedback: false,
       timeRemaining: 45
     }));
   } else {
     
     const finalScore = Math.round(gameState.stepScores.reduce((a, b) => a + b, 0) / communicationSteps.length);
     
     setGameState(prev => ({
       ...prev,
       isComplete: true,
       showFinalFeedback: true,
       score: finalScore
     }));
   }
 };

 const handleSubmit = () => {
  const currentStep = communicationSteps[gameState.currentStep];
  const correctOptions = currentStep.options.filter(opt => opt.correct);
  const selectedCorrect = gameState.selectedOptions.filter(id => 
    currentStep.options.find(opt => opt.id === id && opt.correct)
  ).length;
  const selectedIncorrect = gameState.selectedOptions.filter(id => 
    currentStep.options.find(opt => opt.id === id && !opt.correct)
  ).length;

  const stepScore = Math.max(0, Math.min(100,
    (selectedCorrect / correctOptions.length) * 100 - (selectedIncorrect * 25)
  ));

  const stepSelection = {
    question: currentStep.question,
    selectedOptions: gameState.selectedOptions.map(id => 
      currentStep.options.find(opt => opt.id === id)
    ),
    correctOptions: correctOptions,
    score: stepScore
  };

  const newStepScores = [...gameState.stepScores, stepScore];
  const newStepSelections = [...gameState.stepSelections, stepSelection];

  if (gameState.currentStep < communicationSteps.length - 1) {
    setGameState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      selectedOptions: [],
      stepScores: newStepScores,
      stepSelections: newStepSelections
    }));
  } else {
    
    const finalScore = Math.round(newStepScores.reduce((a, b) => a + b, 0) / communicationSteps.length);
    
    setGameState(prev => ({
      ...prev,
      isComplete: true,
      showFinalFeedback: true,
      score: finalScore,
      stepScores: newStepScores,
      stepSelections: newStepSelections
    }));
  }
};

 const renderStepFeedback = () => {
   const currentStep = communicationSteps[gameState.currentStep];
   const stepSelection = gameState.stepSelections[gameState.currentStep];

   return (
     <div className="bg-white rounded-lg p-6">
       <h2 className="text-xl font-bold mb-4">Step Feedback</h2>
       <h3 className="font-semibold text-lg mb-3">{currentStep.question}</h3>
       
       <div className="space-y-4">
         {stepSelection.selectedOptions.map((option) => (
           <div
             key={option.id}
             className={`p-3 rounded-lg flex items-start gap-2 
               ${stepSelection.correctOptions.some(correct => correct.id === option.id) 
                 ? 'bg-green-50 border-green-200' 
                 : 'bg-red-50 border-red-200'}`}
           >
             {stepSelection.correctOptions.some(correct => correct.id === option.id) ? (
               <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
             ) : (
               <XCircle className="w-5 h-5 text-red-600 mt-1" />
             )}
             <div>
               <div className="font-medium">{option.text}</div>
               <div className="text-sm text-gray-600">
                 {option.explanation}
               </div>
             </div>
           </div>
         ))}
         
         {/* Highlight missed correct options */}
         {stepSelection.correctOptions
           .filter(correct => 
             !stepSelection.selectedOptions.some(selected => selected.id === correct.id)
           )
           .map((missedOption) => (
             <div
               key={missedOption.id}
               className="p-3 rounded-lg bg-yellow-50 border-yellow-200 flex items-start gap-2"
             >
               <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
               <div>
                 <div className="font-medium text-yellow-800">
                   Missed Option: {missedOption.text}
                 </div>
                 <div className="text-sm text-yellow-700">
                   {missedOption.explanation}
                 </div>
               </div>
             </div>
           ))
         }
       </div>

       <button
         onClick={handleContinue}
         className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
       >
         {gameState.currentStep < communicationSteps.length - 1 
           ? 'Next Step' 
           : 'Complete Training'}
       </button>
     </div>
   );
 };

 const renderFinalFeedback = () => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Training Completed</h2>
        <div className="text-xl font-bold text-blue-600">
          Final Score: {gameState.score}%
        </div>
      </div>

      {gameState.stepSelections.map((step, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg">
            Step {index + 1}: {step.question}
          </h3>
          
          <div className="space-y-4">
            {step.selectedOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 rounded-lg ${
                  step.correctOptions.some(correct => correct.id === option.id)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {step.correctOptions.some(correct => correct.id === option.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-1" />
                  )}
                  <div>
                    <div className="font-medium">{option.text}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {option.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Highlight missed correct options */}
            {step.correctOptions
              .filter(correct => 
                !step.selectedOptions.some(selected => selected.id === correct.id)
              )
              .map((missedOption) => (
                <div
                  key={missedOption.id}
                  className="p-4 rounded-lg bg-yellow-50 border-yellow-200 flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <div className="font-medium text-yellow-800">
                      Missed Option: {missedOption.text}
                    </div>
                    <div className="text-sm text-yellow-700">
                      {missedOption.explanation}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          onComplete(VerificationGameType.CONTACT_SUPERVISOR, gameState.score);
        }}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Complete Training
      </button>
    </div>
  );
};
 const renderTutorial = () => (
   <div className="bg-white rounded-lg p-6">
     <div className="space-y-4">
       <div className="flex items-center gap-2">
         <Phone className="w-6 h-6 text-blue-600" />
         <h2 className="text-xl font-bold">Supervisor Communication Training</h2>
       </div>

       <div className="bg-blue-50 p-4 rounded-lg">
         <h3 className="font-semibold mb-2">Your Task:</h3>
         <p className="text-sm text-blue-800">
           Practice proper escalation procedures by identifying concerns, 
           choosing appropriate communication channels, and sharing relevant information.
         </p>
       </div>

       <button
         onClick={() => setGameState(prev => ({ ...prev, showTutorial: false }))}
         className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
       >
         Start Training
       </button>
     </div>
   </div>
 );

 const renderGameContent = () => {
   const currentStep = communicationSteps[gameState.currentStep];

   return (
     <div className="bg-white rounded-lg p-6">
       <div className="mb-6">
         <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-2">
             <Clock className="w-5 h-5 text-blue-600" />
             <span className="font-medium">Time: {gameState.timeRemaining}s</span>
           </div>
           <div className="flex items-center gap-2">
             <MessageCircle className="w-5 h-5 text-blue-600" />
             <span className="font-medium">
               Step {gameState.currentStep + 1} of {communicationSteps.length}
             </span>
           </div>
         </div>
         <div className="w-full bg-gray-200 rounded-full h-2">
           <div 
             className="bg-blue-600 rounded-full h-2 transition-all"
             style={{ width: `${(gameState.timeRemaining / 45) * 100}%` }}
           />
         </div>
       </div>

       <div className="space-y-4">
         <h3 className="font-medium text-lg">{currentStep.question}</h3>
         <div className="space-y-4">
           {currentStep.options.map(option => (
             <div key={option.id} className="space-y-2">
               <button
                 onClick={() => handleOptionSelect(option.id)}
                 className={`w-full p-4 rounded-lg border text-left transition-all
                   ${gameState.selectedOptions.includes(option.id)
                     ? 'border-blue-500 bg-blue-50'
                     : 'border-gray-200 hover:bg-gray-50'
                   }`}
               >
                 {option.text}
               </button>
             </div>
           ))}
         </div>

         <button
           onClick={handleSubmit}
           disabled={gameState.selectedOptions.length === 0}
           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
             disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {gameState.currentStep < communicationSteps.length - 1 ? 'Next Step' : 'Complete Training'}
         </button>
       </div>
     </div>
   );
 };

 
 if (gameState.showTutorial) {
   return renderTutorial();
 }

 if (gameState.showStepFeedback) {
   return renderStepFeedback();
 }

if (gameState.showFinalFeedback) {
   return renderFinalFeedback();
 }

 return renderGameContent();
};

export default ContactSupervisorGame;