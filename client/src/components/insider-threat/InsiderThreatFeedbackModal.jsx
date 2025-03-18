import React from 'react';
import { BookOpen, X } from 'lucide-react';

const InsiderThreatFeedbackModal = ({ feedback, onClose }) => {
  if (!feedback) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold">
                {feedback.isCorrect ? 'Excellent Insight!' : 'Learning Opportunity'}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {feedback.feedbackSections.map((section, index) => (
              <div 
                key={index} 
                className={`p-4 sm:p-6 rounded-lg ${
                  index % 2 === 0 ? 'bg-blue-50' : 'bg-yellow-50'
                }`}
              >
                <h3 className="font-semibold mb-2 text-lg sm:text-xl">{section.title}</h3>
                <p className="text-sm sm:text-base">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              {feedback.isCorrect 
                ? "Great job identifying potential insider threats!" 
                : "Every investigation is a learning opportunity to improve security awareness."}
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Continue Investigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsiderThreatFeedbackModal;
