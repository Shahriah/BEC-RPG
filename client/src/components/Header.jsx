// components/Header.jsx
import React from 'react';
import { Shield, Trophy } from 'lucide-react';

const Header = ({ completedMissions, totalMissions, rank }) => {
  return (
    <header className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Cyber Defense Training</h1>
              <p className="text-blue-100">Current Rank: {rank}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-700/50 px-3 py-2 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">
              {completedMissions}/{totalMissions} Missions Complete
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;