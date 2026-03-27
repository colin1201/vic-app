import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Schedule() {
  const navigate = useNavigate();
  const { members, schedule, updateScheduleEntry, generateSaturdays } = useApp();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    generateSaturdays(startDate, endDate);
    setShowGenerate(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  };

  return (
    <div className="h-svh flex flex-col px-3 py-3 overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="text-earth-light text-sm">←</button>
          <h1 className="font-title text-lg text-earth-dark font-semibold">Schedule</h1>
        </div>
        <button onClick={() => setShowGenerate(!showGenerate)} className="px-2.5 py-0.5 rounded-full bg-forest text-white font-medium text-[9px] shadow-sm">
          + Generate
        </button>
      </div>

      {showGenerate && (
        <div className="bg-warm-card rounded-xl p-2.5 mb-2 shadow-sm border border-warm-border flex-shrink-0">
          <form onSubmit={handleGenerate} className="flex items-end gap-1.5">
            <div className="flex-1">
              <label className="text-[8px] text-earth-light/60 uppercase">From</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-1.5 py-1 rounded-md bg-warm-bg border border-warm-border text-[9px] focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-[8px] text-earth-light/60 uppercase">To</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-1.5 py-1 rounded-md bg-warm-bg border border-warm-border text-[9px] focus:outline-none" />
            </div>
            <button type="submit" className="px-3 py-1 rounded-full bg-forest text-white font-medium text-[9px] shadow-sm whitespace-nowrap">Go</button>
          </form>
        </div>
      )}

      {schedule.length === 0 ? (
        <p className="text-center text-earth-light/50 text-[9px] mt-8">No schedule entries yet.</p>
      ) : (
        <div className="bg-warm-card rounded-xl shadow-sm border border-warm-border overflow-hidden flex-1 min-h-0">
          <div className="overflow-auto h-full">
            <table className="w-full border-collapse text-[8px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-earth-dark text-white/90">
                  <th className="text-left px-1.5 py-1 font-medium whitespace-nowrap w-[52px]">Date</th>
                  <th className="text-left px-1 py-1 font-medium w-[60px]">Study</th>
                  <th className="text-left px-1 py-1 font-medium">Food</th>
                  <th className="text-left px-1 py-1 font-medium">Games</th>
                  <th className="text-left px-1 py-1 font-medium">Worship</th>
                  <th className="text-left px-1 py-1 font-medium">Word</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((entry, i) => (
                  <tr key={entry.id} className={`border-b border-warm-border/40 ${i % 2 === 0 ? 'bg-warm-card' : 'bg-warm-bg/40'}`}>
                    <td className="px-1.5 py-px text-earth font-medium whitespace-nowrap text-[8px]">{formatDate(entry.date)}</td>
                    <td className="px-0.5 py-px">
                      <input type="text" value={entry.study} onChange={(e) => updateScheduleEntry(entry.id, { study: e.target.value })} placeholder="—"
                        className="w-full px-0.5 py-px bg-transparent text-[8px] text-earth placeholder-earth-light/30 focus:outline-none focus:bg-dusty-pink-bg/50 rounded" />
                    </td>
                    {['food_person_id', 'games_person_id', 'worship_person_id', 'word_person_id'].map((key) => (
                      <td key={key} className="px-0.5 py-px">
                        <select value={entry[key] || ''} onChange={(e) => updateScheduleEntry(entry.id, { [key]: e.target.value || null })}
                          className="w-full px-0 py-px bg-transparent text-[8px] text-earth focus:outline-none focus:bg-dusty-pink-bg/50 rounded cursor-pointer">
                          <option value="">—</option>
                          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
