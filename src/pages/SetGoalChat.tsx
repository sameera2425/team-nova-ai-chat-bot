import React, { useState } from 'react';

// TODO: Add daily reminder notifications for goals
// TODO: Track goal progress and show % completion in Dashboard

const goalTypeOptions = [
  'Complete Topic',
  'Revise',
  'Prepare for Exam',
  'Master Skill',
];
const timeOptions = ['30 min', '1 hour', '2 hours'];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
}

function parseGoalInput(input) {
  // Simulate parsing with regex and fallback logic
  let goalType = 'Complete Topic';
  let topic = '';
  let deadline = '';
  let timePerDay = '1 hour';
  let notes = '';

  // Goal type
  if (/revise|review/i.test(input)) goalType = 'Revise';
  else if (/master/i.test(input)) goalType = 'Master Skill';
  else if (/exam|test/i.test(input)) goalType = 'Prepare for Exam';
  else if (/complete|finish|learn/i.test(input)) goalType = 'Complete Topic';

  // Topic
  const topicMatch = input.match(/(?:complete|revise|review|master|learn|study|prepare for|finish)\s+([\w\s]+)/i);
  if (topicMatch) {
    topic = topicMatch[1].replace(/in .*/, '').trim();
  }

  // Time duration
  let days = 21; // default 3 weeks
  const weekMatch = input.match(/(\d+)\s*week/);
  if (weekMatch) days = parseInt(weekMatch[1]) * 7;
  const dayMatch = input.match(/(\d+)\s*day/);
  if (dayMatch) days = parseInt(dayMatch[1]);
  const monthMatch = input.match(/(\d+)\s*month/);
  if (monthMatch) days = parseInt(monthMatch[1]) * 30;
  deadline = addDays(new Date(), days);

  // Time per day
  if (/30 ?min/i.test(input)) timePerDay = '30 min';
  else if (/1 ?hour|one hour/i.test(input)) timePerDay = '1 hour';
  else if (/2 ?hour|two hour/i.test(input)) timePerDay = '2 hours';

  return {
    goalType,
    topic: topic || 'Python',
    deadline,
    timePerDay,
    notes,
  };
}

const SetGoalChat = () => {
  const [userGoalInput, setUserGoalInput] = useState('');
  const [parsedGoal, setParsedGoal] = useState(null);
  const [goalDetails, setGoalDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleLetsGo = () => {
    const parsed = parseGoalInput(userGoalInput);
    setParsedGoal(parsed);
    setGoalDetails(parsed);
    setShowForm(true);
    setConfirmed(false);
  };

  const handleFormChange = (field, value) => {
    setGoalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleEdit = () => {
    setConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="text-blue-700 font-semibold mb-2">Coach</div>
              <div className="text-lg text-blue-900">Hi there! What would you like to achieve today? Type your goal below.</div>
            </div>
            {!showForm && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <input
                  type="text"
                  className="w-full text-lg px-6 py-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  placeholder="e.g. I want to complete Python in 3 weeks"
                  value={userGoalInput}
                  onChange={e => setUserGoalInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLetsGo()}
                />
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 text-lg transition-colors duration-200"
                  onClick={handleLetsGo}
                  disabled={!userGoalInput.trim()}
                >
                  Let's Go →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Smart Form Section */}
      <div className={`flex-1 flex items-center justify-center px-4 py-12 md:py-0 transition-opacity duration-300 ${showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {showForm && goalDetails && (
          <div className="w-full max-w-lg bg-white shadow-lg p-6 rounded-2xl animate-fade-in">
            <div className="text-blue-700 font-semibold mb-4">Personalized Goal Plan</div>
            <form className="space-y-5">
              {/* Goal Type */}
              <div>
                <label className="block font-medium mb-2">Goal Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={goalDetails.goalType}
                  onChange={e => handleFormChange('goalType', e.target.value)}
                >
                  {goalTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              {/* Topic */}
              <div>
                <label className="block font-medium mb-2">Subject / Topic</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={goalDetails.topic}
                  onChange={e => handleFormChange('topic', e.target.value)}
                />
              </div>
              {/* Deadline */}
              <div>
                <label className="block font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={goalDetails.deadline}
                  onChange={e => handleFormChange('deadline', e.target.value)}
                />
              </div>
              {/* Time Commitment */}
              <div>
                <label className="block font-medium mb-2">Time Commitment (per day)</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={goalDetails.timePerDay}
                  onChange={e => handleFormChange('timePerDay', e.target.value)}
                >
                  {timeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {/* Notes */}
              <div>
                <label className="block font-medium mb-2">Notes / Description (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  rows={3}
                  value={goalDetails.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                  placeholder="Add any notes..."
                />
              </div>
              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                {!confirmed && (
                  <button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 px-6 transition-colors duration-200"
                    onClick={handleConfirm}
                  >
                    ✅ Confirm Goal
                  </button>
                )}
                {confirmed && (
                  <button
                    type="button"
                    className="bg-blue-100 text-blue-700 font-semibold rounded-xl py-3 px-6 transition-colors duration-200 border border-blue-200"
                    onClick={handleEdit}
                  >
                    📝 Edit Details
                  </button>
                )}
              </div>
              {confirmed && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 whitespace-pre-line">
                  Goal confirmed! 🎉
                  <br />
                  {`You want to ${goalDetails.goalType.toLowerCase()} "${goalDetails.topic}" by ${goalDetails.deadline}, spending ${goalDetails.timePerDay}/day.`}
                  {goalDetails.notes && <><br />Notes: {goalDetails.notes}</>}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetGoalChat; 