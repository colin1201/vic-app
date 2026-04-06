import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i); // last year to 3 years ahead

export default function Schedule() {
  const navigate = useNavigate();
  const { members, schedule, updateScheduleEntry, deleteScheduleEntry, addScheduleEntry, cancelScheduleEntry, cancelAndShiftStudy, generateYearSaturdays } = useApp();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [menuId, setMenuId] = useState(null);
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [editStudyId, setEditStudyId] = useState(null);
  const [editStudyValue, setEditStudyValue] = useState('');

  // Auto-generate Saturdays when year changes
  useEffect(() => {
    generateYearSaturdays(selectedYear);
  }, [selectedYear]);

  const yearSchedule = schedule.filter(s => s.date.startsWith(String(selectedYear)) && !s.hidden);
  const getMemberName = (id) => members.find(m => m.id === id)?.name || '—';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()}-${MONTHS_SHORT[d.getMonth()]}`;
  };

  const getDay = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return DAYS_SHORT[d.getDay()];
  };

  const handleNoCell = (id) => {
    deleteScheduleEntry(id);
    setMenuId(null);
  };

  const handleCancelAndShift = (id) => {
    cancelAndShiftStudy(id);
    setMenuId(null);
  };

  const handleUncancel = (id) => {
    updateScheduleEntry(id, { cancelled: false });
    setMenuId(null);
  };

  const handleAddDate = () => {
    if (!newDate) return;
    addScheduleEntry(newDate);
    setNewDate('');
    setShowAddDate(false);
  };

  return (
    <div className="h-svh flex flex-col px-3 py-3 overflow-hidden">
      <div className="relative mb-2 flex-shrink-0">
        <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-0 top-1">←</button>
        <h1 className="font-logo text-3xl text-earth-dark text-center" style={{ fontWeight: 100 }}>Schedule</h1>
      </div>

      {/* Year filter + Add date */}
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <span className="text-[11px] text-earth-light font-medium">Year</span>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-2.5 py-1 rounded-full bg-forest text-white text-[11px] font-medium focus:outline-none cursor-pointer shadow-sm">
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={() => setShowAddDate(!showAddDate)}
          className="text-xs text-amber font-medium ml-auto hover:text-amber-dark transition-colors">
          + New Date
        </button>
      </div>

      {showAddDate && (
        <div className="flex items-center gap-2 mb-2 flex-shrink-0">
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
            className="px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-[10px] text-earth focus:outline-none" />
          <button onClick={handleAddDate} className="text-[10px] text-forest font-medium">Add</button>
          <button onClick={() => { setShowAddDate(false); setNewDate(''); }} className="text-[10px] text-earth-light">Cancel</button>
        </div>
      )}

      {/* Schedule table */}
      <div className="bg-warm-card rounded-xl shadow-sm border border-warm-border overflow-hidden flex-1 min-h-0">
        <div className="overflow-auto h-full">
          <table className="w-full border-collapse text-[9px] table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-forest-dark text-white/90">
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '12%' }}>Date</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '8%' }}>Day</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '24%' }}>Study</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '13%' }}>Word</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '13%' }}>Worship</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '13%' }}>Food</th>
                <th className="text-center px-0.5 py-1 font-medium" style={{ width: '13%' }}>Games</th>
                <th className="py-1" style={{ width: '4%' }}></th>
              </tr>
            </thead>
            <tbody>
              {yearSchedule.map((entry, i) => (
                <tr key={entry.id} className={`border-b border-warm-border/40 ${
                  entry.cancelled
                    ? 'bg-warm-bg/60 opacity-50'
                    : i % 2 === 0 ? 'bg-warm-card' : 'bg-warm-bg/40'
                }`}>
                  <td className="px-1 py-px relative">
                    <span className="text-[9px] text-earth font-medium whitespace-nowrap pointer-events-none">
                      {formatDate(entry.date)}
                      {entry.cancelled && <span className="text-dusty-pink ml-0.5 text-[7px]">✕</span>}
                    </span>
                    <input type="date" value={entry.date}
                      onChange={(e) => e.target.value && updateScheduleEntry(entry.id, { date: e.target.value })}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </td>
                  <td className="px-1 py-px text-earth-light text-[8px]">
                    {getDay(entry.date)}
                  </td>
                  <td className="px-0.5 py-px">
                    {entry.cancelled ? (
                      <span className="text-[9px] text-earth-light/70 line-through px-0.5">{entry.study || '—'}</span>
                    ) : (
                      <button onClick={() => { setEditStudyId(entry.id); setEditStudyValue(entry.study); }}
                        className="w-full px-0.5 py-px bg-transparent text-[9px] text-earth text-left truncate hover:bg-amber-bg/50 rounded cursor-pointer">
                        {entry.study || <span className="text-earth-light/60">—</span>}
                      </button>
                    )}
                  </td>
                  {['word_person_id', 'worship_person_id', 'food_person_id', 'games_person_id'].map((key) => (
                    <td key={key} className="px-0.5 py-px relative">
                      {entry.cancelled ? (
                        <span className="text-[9px] text-earth-light/60 px-0.5 block text-center">—</span>
                      ) : (
                        <>
                          <span className={`text-[9px] px-0.5 truncate block pointer-events-none text-center ${
                            entry[key] ? 'text-earth border-b border-dotted border-earth-light/30' : 'text-earth-light/60'
                          }`}>
                            {entry[key] ? getMemberName(entry[key]) : '—'}
                          </span>
                          <select value={entry[key] || ''} onChange={(e) => updateScheduleEntry(entry.id, { [key]: e.target.value || null })}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
                            <option value="">—</option>
                            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </>
                      )}
                    </td>
                  ))}
                  <td className="px-0 py-px">
                    <button
                      onClick={() => setMenuId(menuId === entry.id ? null : entry.id)}
                      className="text-earth-light/60 hover:text-dusty-pink text-[8px] px-0.5 transition-colors"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Study edit popup */}
      {editStudyId && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setEditStudyId(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-warm-card rounded-2xl shadow-xl border border-warm-border p-4 w-[280px]">
            <p className="text-[11px] text-earth font-medium mb-2">Edit Study</p>
            <input
              type="text"
              value={editStudyValue}
              onChange={(e) => setEditStudyValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { updateScheduleEntry(editStudyId, { study: editStudyValue }); setEditStudyId(null); }
              }}
              className="w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30 mb-3"
              placeholder="Study topic..."
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditStudyId(null)} className="text-[10px] text-earth-light">Cancel</button>
              <button onClick={() => { updateScheduleEntry(editStudyId, { study: editStudyValue }); setEditStudyId(null); }}
                className="px-4 py-1 rounded-full bg-forest text-white text-[10px] font-medium">Save</button>
            </div>
          </div>
        </>
      )}

      {/* Action popup */}
      {menuId && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuId(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-warm-card rounded-2xl shadow-xl border border-warm-border p-4 w-[260px] text-center">
            <p className="text-[11px] text-earth mb-3 font-medium">
              {formatDate(schedule.find(s => s.id === menuId)?.date || '')}
            </p>
            {schedule.find(s => s.id === menuId)?.cancelled ? (
              <button
                onClick={() => handleUncancel(menuId)}
                className="w-full py-1.5 rounded-full bg-forest text-white text-[11px] font-medium mb-1.5"
              >
                Restore this week
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNoCell(menuId)}
                  className="w-full py-1.5 rounded-full bg-earth text-white text-[11px] font-medium mb-1.5"
                >
                  No Cell
                </button>
                <button
                  onClick={() => handleCancelAndShift(menuId)}
                  className="w-full py-1.5 rounded-full bg-amber text-white text-[11px] font-medium mb-1.5"
                >
                  Cancel Cell & Shift Study Down
                </button>
              </>
            )}
            <button
              onClick={() => setMenuId(null)}
              className="text-[10px] text-earth-light mt-1"
            >
              Never mind
            </button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
