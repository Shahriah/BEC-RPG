// components/insider-threat/TeamNotes.jsx
import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

const TeamNotes = ({ currentRole, teamMembers, onNoteAdded }) => {
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      author: teamMembers[currentRole].name,
      content: newNote,
      timestamp: new Date().toLocaleTimeString(),
      tags: ['Investigation', 'Observation']
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
    setShowAddNote(false);
    onNoteAdded?.(note);
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Investigation Notes
        </h3>
        <button 
          onClick={() => setShowAddNote(true)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {showAddNote && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm mb-2"
            placeholder="Enter your observation..."
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddNote(false)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notes.map((note, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{note.author}</span>
              <span className="text-xs text-gray-500">{note.timestamp}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{note.content}</p>
            <div className="flex gap-2">
              {note.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamNotes;