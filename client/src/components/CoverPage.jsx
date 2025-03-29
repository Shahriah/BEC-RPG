import React from 'react';
import { 
  Mail, 
  Users, 
  FileText, 
  Shield,
  AlertTriangle,
  Info
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
 

const CoverPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <header className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-900">Cyber Defense Training</h1>
          <p className="text-gray-600">Welcome to your security training platform</p>
        </header>

        {/* game boxes */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* email urgency game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Email Urgency Detection</h2>
            </div>
            <p className="mb-4 text-gray-600">Identify phishing attempts and suspicious emails.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">How to Play:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Read the email scenario</li>
                <li>Click on suspicious elements in the email</li>
                <li>Choose the appropriate response action</li>
                <li>Review feedback to improve your skills</li>
              </ol>
            </div>
          </div>

          {/* insider threat game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Insider Threat Detection</h2>
            </div>
            <p className="mb-4 text-gray-600">Identify suspicious behavior patterns within your organization.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">How to Play:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Review employee activity timelines</li>
                <li>Investigate suspicious patterns</li>
                <li>Flag potential threats</li>
                <li>Learn from feedback on your decisions</li>
              </ol>
            </div>
          </div>

          {/* BEC security game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Business Email Security</h2>
            </div>
            <p className="mb-4 text-gray-600">Protect against Business Email Compromise attacks.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">How to Play:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Complete verification mini-games</li>
                <li>Check sender details and policy compliance</li>
                <li>Take appropriate action on the email</li>
                <li>Review security protocols and best practices</li>
              </ol>
            </div>
          </div>

          {/* data security game */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Data Security Protocol</h2>
            </div>
            <p className="mb-4 text-gray-600">Classify and protect sensitive company information.</p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">How to Play:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Review the data scenario</li>
                <li>Choose the correct data classification</li>
                <li>Set appropriate access controls</li>
                <li>Apply security measures to protect the data</li>
              </ol>
            </div>
          </div>
        </div>

        {/* roles and achievements box */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* roles */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Role Selection</h2>
              </div>
              <p className="mb-4 text-gray-600">Choose your organizational role to experience different security perspectives.</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Available Roles:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li><strong>CEO:</strong> Executive-level security strategy</li>
                  <li><strong>Finance:</strong> Financial transaction security</li>
                  <li><strong>IT Security:</strong> System and network protection</li>
                  <li><strong>HR:</strong> Employee data and access management</li>
                </ul>
              </div>
            </div>

            {/* achievements */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold">Achievements</h2>
              </div>
              <p className="mb-4 text-gray-600">Complete missions to earn points and advance your rank.</p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Rank Progression:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li><strong>Rookie:</strong> Starting rank</li>
                  <li><strong>Trainee:</strong> 500 points</li>
                  <li><strong>Defender:</strong> 1,500 points</li>
                  <li><strong>Security Expert:</strong> 3,000 points</li>
                  <li><strong>Cyber Master:</strong> 5,000 points</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* start button */}
        <div className="mt-6 text-center">
        <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
            Start Training
        </button>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;