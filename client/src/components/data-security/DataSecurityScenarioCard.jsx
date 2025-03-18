
import React from 'react';
import { FileText } from 'lucide-react';
import { CheckCircle, XCircle, Info as InfoIcon } from 'lucide-react';


// displays the current scenario
export const ScenarioCard = ({ scenario }) => {
  const Icon = scenario.icon || FileText;
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">{scenario.title}</h3>
          <p className="text-sm text-gray-600">Data Type: {scenario.dataType}</p>
        </div>
      </div>
      <div className="font-mono text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
        {scenario.content}
      </div>
    </div>
  );
};

// allows the user to select and deslect options 
export const ChoiceSelector = ({ 
  title, 
  icon: Icon, 
  options, 
  selected, 
  onChange,
  disabled 
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(options).map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`p-3 rounded-lg border text-left transition-all ${
              selected === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm text-gray-600">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// renders and decides user feedback
export const FeedbackPanel = ({
  choices,
  correctChoices,
  explanations,
  securityTips,
  onNext
}) => {
  const getChoiceResult = (category) => {
    return choices[category] === correctChoices[category];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
      <h3 className="font-semibold mb-4">Analysis & Feedback</h3>
      
      <div className="space-y-4">
        {Object.entries(choices).map(([category, choice]) => (
          <div
            key={category}
            className={`p-4 rounded-lg ${
              getChoiceResult(category) ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {getChoiceResult(category) ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h4 className="font-medium capitalize">
                {category.replace(/_/g, ' ')}
              </h4>
            </div>
            <p className="text-sm mt-2">
              {explanations[category]}
            </p>
          </div>
        ))}

        {securityTips && (
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium flex items-center gap-2">
              <InfoIcon className="w-4 h-4" />
              Security Tips
            </h4>
            <ul className="mt-2 space-y-2">
              {securityTips.map((tip, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Continue
        </button>
      </div>
    </div>
  );
};