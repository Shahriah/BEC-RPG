import React from 'react';
import { Trophy } from 'lucide-react';

const AchievementBanner = ({ achieved, total }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Achievement Unlocked!</h3>
            <p className="text-sm text-gray-600">
              Complete all missions to become a Cyber Defense Master
            </p>
          </div>
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          {achieved}/{total} Achievements
        </div>
      </div>
    </div>
  );
};

export default AchievementBanner;
