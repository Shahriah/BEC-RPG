import React, { useState, useEffect } from 'react';
import { Phone, Clock, CheckCircle, XCircle, MessageCircle, Mail } from 'lucide-react';

const ContactSupervisorGame = ({ email, onComplete }) => {
 const [gameState, setGameState] = useState({
   showTutorial: true,
   currentStep: 0,
   selectedOptions: [],
   timeRemaining: 45,
   isComplete: false,
   score: 0,
   stepScores: [],
   feedbackVisible: false,
   showStepFeedback: false
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
  
    const newStepScores = [...gameState.stepScores, stepScore];
  
    // Set isComplete and feedbackVisible regardless of current step
    setGameState(prev => ({
      ...prev,
      isComplete: true,
      feedbackVisible: true
    }));
  
    if (gameState.currentStep < communicationSteps.length - 1) {
      setGameState(prev => ({
        ...prev,
        showStepFeedback: true
      }));
    } else {
      const finalScore = Math.round(newStepScores.reduce((a, b) => a + b, 0) / communicationSteps.length);
      setGameState(prev => ({
        ...prev,
        score: finalScore
      }));
  
      // Call onComplete callback only when last step is completed
      setTimeout(() => {
        onComplete(finalScore);
      }, 100);
    }
  };

 const handleContinue = () => {
   setGameState(prev => ({
     ...prev,
     currentStep: prev.currentStep + 1,
     selectedOptions: [],
     showStepFeedback: false,
     timeRemaining: 45
   }));
 };

 const renderEmailPreview = () => (
   <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
     <div className="space-y-2">
       <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2">
           <Mail className="w-4 h-4 text-gray-500" />
           <span className="text-sm text-gray-600">From:</span>
         </div>
         <span className="text-sm font-mono">{email?.from}</span>
       </div>
       <div className="flex items-center justify-between">
         <span className="text-sm text-gray-600">Subject:</span>
         <span className="text-sm">{email?.subject}</span>
       </div>
       <div className="flex items-center justify-between">
         <span className="text-sm text-gray-600">Time:</span>
         <span className="text-sm">{email?.timestamp}</span>
       </div>
       <div className="mt-4 pt-4 border-t border-gray-100">
         <div className="text-sm whitespace-pre-wrap text-gray-800">
           {email?.content}
         </div>
       </div>
     </div>
   </div>
 );

 if (gameState.showTutorial) {
   return (
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
 }

if (gameState.isComplete && gameState.feedbackVisible) {
   return (
     <div className="bg-white rounded-lg p-6">
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <CheckCircle className="w-6 h-6 text-green-600" />
             <h2 className="text-xl font-bold">Completed!</h2>
           </div>
           <div className="text-lg font-bold">
             Score: {gameState.score}%
           </div>
         </div>

         <button
           onClick={() => onComplete(gameState.score)}
           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
         >
           Continue to Next Step
         </button>
         
       </div>
     </div>
   );
 }

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

     {renderEmailPreview()}

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

       {gameState.showStepFeedback ? (
         <div className="space-y-4">
           {currentStep.options.map(option => (
             <div
               key={option.id}
               className={`p-3 rounded-lg ${
                 option.correct ? 'bg-green-50' : 'bg-red-50'
               }`}
             >
               <div className="flex items-start gap-2">
                 {option.correct ? (
                   <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                 ) : (
                   <XCircle className="w-4 h-4 text-red-600 mt-1" />
                 )}
                 <div>
                   <div className="font-medium">{option.text}</div>
                   <div className="text-sm text-gray-600">
                     {option.explanation}
                   </div>
                 </div>
               </div>
             </div>
           ))}
           <button
             onClick={handleContinue}
             className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
           >
             Continue to Next Step
           </button>
         </div>
       ) : (
         <button
           onClick={handleSubmit}
           disabled={gameState.selectedOptions.length === 0}
           className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
             disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {gameState.currentStep < communicationSteps.length - 1 ? 'Next Step' : 'Complete Training'}
         </button>
       )}
     </div>
   </div>
 );
};

export default ContactSupervisorGame;