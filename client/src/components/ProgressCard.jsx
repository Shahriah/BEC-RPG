import React from 'react';
import { Target, Medal } from 'lucide-react';

const ProgressCard = ({ progress, points }) => {
  
  const getNextRankInfo = (currentPoints) => {
    if (currentPoints < 500) return { rank: 'Trainee', threshold: 500 };
    if (currentPoints < 1500) return { rank: 'Defender', threshold: 1500 };
    if (currentPoints < 3000) return { rank: 'Security Expert', threshold: 3000 };
    if (currentPoints < 5000) return { rank: 'Cyber Master', threshold: 5000 };
    return { rank: 'Maximum Rank Achieved', threshold: null };
  };

  // obtains user rank
  const nextRank = getNextRankInfo(points);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Target className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Mission Progress
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
          <Medal className="w-5 h-5 text-yellow-600" />
          <span className="text-sm sm:text-base text-gray-900 font-medium">
            {points} Points
          </span>
        </div>
      </div>
      
      {/* progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* details about progress which calculates points to next rank */}
      <div className="flex flex-col sm:flex-row justify-between mt-2 text-xs sm:text-sm text-gray-600">
        <span>{Math.round(progress)}% Missions Complete</span>
        {nextRank.threshold && (
          <span>
            {nextRank.threshold - points} points to {nextRank.rank}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;
