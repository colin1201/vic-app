import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear - i);

export default function Family() {
  const { members, addMember, addEvent } = useApp();
  const navigate = useNavigate();

  // Which panel is open: null, 'add', or 'event'
  const [panel, setPanel] = useState(null);

  // Add member form
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Guy');
  const [bDay, setBDay] = useState('');
  const [bMonth, setBMonth] = useState('1');
  const [bYear, setBYear] = useState('');
  const [addError, setAddError] = useState('');

  // Log event form (story style)
  const [eventMemberId, setEventMemberId] = useState('');
  const [activity, setActivity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState('available');
  const [alsoAppliesTo, setAlsoAppliesTo] = useState([]);
  const [eventError, setEventError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) { setAddError('Name is required'); return; }
    if (!bDay || Number(bDay) < 1 || Number(bDay) > 31) { setAddError('Valid birthday day is required'); return; }
    addMember({
      name: name.trim(),
      gender,
      birthday_day: Number(bDay),
      birthday_month: Number(bMonth),
      birthday_year: bYear ? Number(bYear) : null,
    });
    setName(''); setBDay(''); setBMonth('1'); setBYear(''); setAddError('');
    setPanel(null);
  };

  const handleLogEvent = (e) => {
    e.preventDefault();
    if (!eventMemberId) { setEventError('Pick a family member'); return; }
    if (!activity.trim()) { setEventError('Activity is required'); return; }
    if (!startDate) { setEventError('Start date is required'); return; }
    addEvent({
      member_id: eventMemberId,
      activity: activity.trim(),
      start_date: startDate,
      end_date: endDate || startDate,
      availability,
      alsoAppliesTo,
    });
    setEventMemberId(''); setActivity(''); setStartDate(''); setEndDate('');
    setAvailability('available'); setAlsoAppliesTo([]); setEventError('');
    setPanel(null);
  };

  const toggleAlsoApplies = (id) => {
    setAlsoAppliesTo(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const otherMembers = members.filter(m => m.id !== eventMemberId);

  const guys = members.filter(m => m.gender === 'Guy');
  const girls = members.filter(m => m.gender === 'Girl');

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30";

  return (
    <div className="min-h-svh px-5 py-5">
      <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-3xl text-earth-dark text-center mb-5" style={{ fontWeight: 100 }}>The Family</h1>

      {/* Action buttons */}
      {panel === null && (
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={() => setPanel('add')}
            className="text-xs text-forest font-medium hover:text-forest-dark transition-colors">
            + Add Family Member
          </button>
          <button onClick={() => setPanel('event')}
            className="text-xs text-amber font-medium hover:text-amber-dark transition-colors">
            + Log Event
          </button>
        </div>
      )}

      {/* Add Member Panel */}
      {panel === 'add' && (
        <div className="bg-warm-card rounded-2xl p-4 mb-5 shadow-sm border border-warm-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-earth-light uppercase tracking-widest">Add Family Member</h2>
            <button onClick={() => { setPanel(null); setAddError(''); }} className="text-earth-light text-xs">Cancel</button>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-full bg-warm-bg border border-warm-border text-xs placeholder-earth-light/50 focus:outline-none focus:ring-2 focus:ring-amber/30" autoFocus />
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                className="px-2 py-1.5 rounded-full bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
                <option value="Guy">Guy</option>
                <option value="Girl">Girl</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-earth-light shrink-0">Birthday:</span>
              <input type="number" min="1" max="31" placeholder="Day" value={bDay} onChange={(e) => setBDay(e.target.value)}
                className="w-12 px-2 py-1 rounded-full bg-warm-bg border border-warm-border text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber/30" />
              <select value={bMonth} onChange={(e) => setBMonth(e.target.value)}
                className="px-2 py-1 rounded-full bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              <select value={bYear} onChange={(e) => setBYear(e.target.value)}
                className="px-2 py-1 rounded-full bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
                <option value="">Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {addError && <p className="text-dusty-pink text-xs px-1">{addError}</p>}
            <button type="submit" className="w-full py-1.5 rounded-full bg-forest text-white font-medium text-xs hover:bg-forest-dark transition-colors shadow-sm">
              Add Member
            </button>
          </form>
        </div>
      )}

      {/* Log Event Panel — story style */}
      {panel === 'event' && (
        <div className="bg-warm-card rounded-2xl p-4 mb-5 shadow-sm border border-warm-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-earth-light uppercase tracking-widest">Log Event</h2>
            <button onClick={() => { setPanel(null); setEventError(''); }} className="text-earth-light text-xs">Cancel</button>
          </div>
          <form onSubmit={handleLogEvent} className="flex flex-col gap-3">
            {/* Who is this for — at the top */}
            <div>
              <label className="text-xs text-earth-light font-medium block mb-1.5">Who is this for?</label>
              <select value={eventMemberId} onChange={(e) => { setEventMemberId(e.target.value); setAlsoAppliesTo([]); }}
                className={inputClass}>
                <option value="">Pick a family member</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            {/* Story sentence — only show after picking a member */}
            {eventMemberId && (
              <>
                <div className="border-t border-warm-border pt-3 text-xs text-earth leading-relaxed space-y-2.5">
                  {/* Line 1: I'm ___ */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-earth-light font-medium">I am/have</span>
                    <input type="text" placeholder="on holiday, overseas..." value={activity} onChange={(e) => setActivity(e.target.value)}
                      className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30" autoFocus />
                  </div>

                  {/* Line 2: from ___ to ___ */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-earth-light font-medium">from</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 min-w-[110px] px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30" />
                    <span className="text-earth-light font-medium">to</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 min-w-[110px] px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30" />
                  </div>

                  {/* Line 3: and I'm ___ for Cell */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-earth-light font-medium">and I am</span>
                    <select value={availability} onChange={(e) => setAvailability(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
                      <option value="available">available</option>
                      <option value="unavailable">unavailable</option>
                    </select>
                    <span className="text-earth-light font-medium">for Cell</span>
                  </div>
                </div>

                {/* Also applies to — dropdown */}
                {otherMembers.length > 0 && (
                  <div className="border-t border-warm-border pt-3">
                    <label className="text-xs text-earth-light font-medium block mb-1.5">This also applies to:</label>
                    <select
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !alsoAppliesTo.includes(val)) setAlsoAppliesTo(prev => [...prev, val]);
                      }}
                      className={inputClass}>
                      <option value="">Select a member to add...</option>
                      {otherMembers.filter(m => !alsoAppliesTo.includes(m.id)).map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    {alsoAppliesTo.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {alsoAppliesTo.map(aId => {
                          const m = members.find(x => x.id === aId);
                          return m ? (
                            <span key={aId} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest/10 border border-forest/20 text-xs text-forest font-medium">
                              {m.name}
                              <button type="button" onClick={() => setAlsoAppliesTo(prev => prev.filter(x => x !== aId))} className="text-forest/50 hover:text-forest">×</button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {eventError && <p className="text-dusty-pink text-xs px-1">{eventError}</p>}
            <button type="submit" className="w-full py-2 rounded-full bg-forest text-white font-medium text-xs hover:bg-forest-dark transition-colors shadow-sm">
              Log Event
            </button>
          </form>
        </div>
      )}

      {/* Guys & Girls sections — only show when no panel is open */}
      {panel !== 'event' && (
        <div className="mt-8 flex gap-4">
          <div className="bg-warm-card rounded-2xl p-4 mb-4 shadow-sm border border-warm-border flex-1">
            <h2 className="font-title text-base font-semibold text-earth-dark text-center mb-3">Guys</h2>
            <div className="flex flex-col gap-1.5">
              {guys.map((m) => (
                <button key={m.id} onClick={() => navigate(`/family/${m.id}`)}
                  className="w-full text-center px-3 py-1 rounded-full bg-warm-bg border border-warm-border text-xs text-earth shadow-sm hover:border-amber hover:shadow-md transition-all">
                  {m.name}
                </button>
              ))}
              {guys.length === 0 && <p className="text-xs text-earth-light/70">No members yet</p>}
            </div>
          </div>

          <div className="bg-warm-card rounded-2xl p-4 mb-4 shadow-sm border border-warm-border flex-1">
            <h2 className="font-title text-base font-semibold text-earth-dark text-center mb-3">Girls</h2>
            <div className="flex flex-col gap-1.5">
              {girls.map((m) => (
                <button key={m.id} onClick={() => navigate(`/family/${m.id}`)}
                  className="w-full text-center px-3 py-1 rounded-full bg-warm-bg border border-warm-border text-xs text-earth shadow-sm hover:border-amber hover:shadow-md transition-all">
                  {m.name}
                </button>
              ))}
              {girls.length === 0 && <p className="text-xs text-earth-light/70">No members yet</p>}
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
