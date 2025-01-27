// components/RoleSelectionSection.jsx
import React from 'react';
import { Shield, Users, BadgeDollarSign, UserCog } from 'lucide-react';
import { Roles } from '../types/roleTypes';

const RoleSelectionCard = ({ role, isSelected, onSelect }) => {
  const roleIcons = {
    ceo: Shield,
    finance: BadgeDollarSign,
    it_security: UserCog,
    hr: Users
  };

  const Icon = roleIcons[role.id] || Shield;

  return (
    <div
      onClick={() => onSelect(role)}
      className={`
        bg-white rounded-lg p-4 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-blue-500 shadow-md' 
          : 'hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{role.title}</h3>
          <p className="text-xs text-gray-500">{role.description}</p>
        </div>
      </div>
    </div>
  );
};

const RoleSelectionSection = ({ selectedRole, onRoleSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium text-gray-900">Select Your Role</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Choose your role to experience different security perspectives
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {Object.values(Roles).map((role) => (
          <RoleSelectionCard
            key={role.id}
            role={role}
            isSelected={selectedRole?.id === role.id}
            onSelect={onRoleSelect}
          />
        ))}
      </div>

      {selectedRole && (
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">Current Role:</span>
              <span className="text-sm text-gray-900">{selectedRole.title}</span>
            </div>
            <button
              onClick={() => onRoleSelect(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionSection;