import React from 'react';
import { Star, Lock, Unlock, Target, Crown } from 'lucide-react';

const MissionCard = ({ mission, onStart, selectedRole }) => {  
  const { 
    title, 
    description, 
    icon: Icon,
    completed,
    score,
    achievement,
    difficulty,
    locked 
  } = mission;

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md p-4 sm:p-6 transition-all duration-300
        ${locked ? 'opacity-70' : 'hover:shadow-xl hover:-translate-y-1'}
      `}
    >
      {/* header which ocntains title and icon */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <div className={`p-2 rounded-lg ${locked ? 'bg-gray-100' : 'bg-blue-100'}`}>
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${locked ? 'text-gray-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {completed && (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <Star className="w-3 h-3" />
            <span className="text-xs sm:text-sm font-medium">{score}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm">
            {difficulty}
          </span>
          {achievement && (
            <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm">
              <Crown className="w-3 h-3" />
              {achievement}
            </span>
          )}
        </div>
        
        <button
          onClick={onStart}
          disabled={locked}
          className={`
            w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center gap-2
            font-medium transition-all duration-200
            ${locked 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : completed 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {locked ? (
            <>
              <Lock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                {!selectedRole ? "Select Role to Unlock" : "Complete Previous Mission"}
              </span>
            </>
          ) : completed ? (
            <>
              <Unlock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Mission Complete</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Start Mission</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MissionCard;
