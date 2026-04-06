import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear - i);

export default function PersonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, updateMember, deleteMember, events, addEvent, deleteEvent } = useApp();
  const member = members.find(m => m.id === id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(member?.name || '');
  const [showArchived, setShowArchived] = useState(false);
  const [showLogEvent, setShowLogEvent] = useState(false);

  const [activity, setActivity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState('available');
  const [alsoAppliesTo, setAlsoAppliesTo] = useState([]);
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [bDay, setBDay] = useState(member?.birthday_day || '');
  const [bMonth, setBMonth] = useState(member?.birthday_month || 1);
  const [bYear, setBYear] = useState(member?.birthday_year || '');

  if (!member) {
    return <div className="min-h-svh px-5 py-5 flex items-center justify-center"><p className="text-earth-light text-xs">Member not found.</p></div>;
  }

  const memberEvents = events.filter(e => e.member_id === id);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const activeEvents = memberEvents.filter(e => e.end_date >= today);
  const archivedEvents = memberEvents.filter(e => e.end_date < today);
  const otherMembers = members.filter(m => m.id !== id);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!startDate) return;
    addEvent({
      member_id: id,
      activity: activity || 'Activity',
      start_date: startDate,
      end_date: endDate || startDate,
      availability,
      alsoAppliesTo,
    });
    setActivity(''); setStartDate(''); setEndDate(''); setAvailability('available'); setAlsoAppliesTo([]);
    setShowLogEvent(false);
  };

  const handleSaveBirthday = () => {
    updateMember(id, {
      birthday_day: Number(bDay),
      birthday_month: Number(bMonth),
      birthday_year: bYear ? Number(bYear) : null,
    });
    setEditingBirthday(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };

  const formatBirthday = () => {
    if (!member.birthday_day) return 'Not set';
    const parts = [`${member.birthday_day} ${MONTHS[member.birthday_month - 1]}`];
    if (member.birthday_year) parts.push(member.birthday_year);
    return parts.join(' ');
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30";

  const EventRow = ({ event }) => (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded-full text-xs ${
      event.availability === 'available' ? 'bg-forest/5 border border-forest/20 text-earth' : 'bg-warm-bg border border-warm-border text-earth-light'
    }`}>
      <span>
        {event.activity} · {formatDate(event.start_date)}
        {event.end_date !== event.start_date && ` – ${formatDate(event.end_date)}`}
        <span className={`ml-1 ${event.availability === 'available' ? 'text-forest' : 'text-earth-light'}`}> · {event.availability}</span>
      </span>
      <button onClick={() => deleteEvent(event.id)} className="text-earth-light/70 hover:text-dusty-pink ml-2">x</button>
    </div>
  );

  return (
    <div className="min-h-svh px-5 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/family')} className="text-earth-light text-sm">←</button>
          {editingName ? (
            <div className="flex items-center gap-1.5">
              <input type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && nameValue.trim()) { updateMember(id, { name: nameValue.trim() }); setEditingName(false); } }}
                className="font-title text-xl text-earth-dark font-semibold bg-transparent border-b border-amber focus:outline-none w-32" autoFocus />
              <button onClick={() => { if (nameValue.trim()) { updateMember(id, { name: nameValue.trim() }); setEditingName(false); } }} className="text-forest text-xs font-medium">Save</button>
              <button onClick={() => { setNameValue(member.name); setEditingName(false); }} className="text-earth-light text-xs">x</button>
            </div>
          ) : (
            <h1 className="font-title text-xl text-earth-dark font-semibold cursor-pointer" onClick={() => setEditingName(true)}>{member.name}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editingName && <button onClick={() => setEditingName(true)} className="text-[11px] px-2 py-0.5 rounded-full bg-warm-bg border border-warm-border text-earth-light">Edit</button>}
          <button onClick={() => setShowDeleteConfirm(true)} className="text-[11px] px-2 py-0.5 rounded-full bg-dusty-pink-bg border border-dusty-pink-light text-dusty-pink">Delete</button>
        </div>
      </div>

      {/* + Log Event button */}
      <button onClick={() => setShowLogEvent(true)}
        className="w-full py-2 rounded-full bg-forest text-white font-medium text-xs tracking-wide hover:bg-forest-dark transition-colors shadow-sm mb-4">
        + Log Event
      </button>

      {showDeleteConfirm && (
        <div className="bg-warm-card rounded-2xl p-3.5 mb-3 shadow-sm border border-dusty-pink-light text-center">
          <p className="text-xs text-earth mb-2">Delete <strong>{member.name}</strong> and all their events?</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-1 rounded-full bg-warm-bg border border-warm-border text-earth-light text-xs">Cancel</button>
            <button onClick={() => { deleteMember(id); navigate('/family'); }} className="px-4 py-1 rounded-full bg-dusty-pink text-white text-xs font-medium">Yes, delete</button>
          </div>
        </div>
      )}

      {/* Log Event popup */}
      {showLogEvent && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowLogEvent(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-warm-card rounded-2xl shadow-xl border border-warm-border p-4 w-[310px] max-h-[80svh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-earth-light uppercase tracking-widest">Log Event</h2>
              <button onClick={() => setShowLogEvent(false)} className="text-earth-light text-[11px]">Cancel</button>
            </div>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-2.5">
              <div className="text-xs text-earth leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-earth-light font-medium">I am/have</span>
                  <input type="text" placeholder="on holiday, overseas..." value={activity} onChange={(e) => setActivity(e.target.value)}
                    className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30" autoFocus />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-earth-light font-medium">from</span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 min-w-[110px] px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30" />
                  <span className="text-earth-light font-medium">to</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 min-w-[110px] px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30" />
                </div>
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

              {otherMembers.length > 0 && (
                <div className="border-t border-warm-border pt-2.5">
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

              <button type="submit" className="w-full py-1.5 rounded-full bg-forest text-white font-medium text-xs hover:bg-forest-dark transition-colors shadow-sm">Submit</button>
            </form>
          </div>
        </>
      )}

      {/* Birthday */}
      <div className="bg-warm-card rounded-2xl p-4 mb-3 shadow-sm border border-warm-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-semibold text-earth-light uppercase tracking-widest">Birthday</h2>
          <button onClick={() => setEditingBirthday(!editingBirthday)} className="text-amber text-xs font-medium">{editingBirthday ? 'Cancel' : 'Edit'}</button>
        </div>
        {editingBirthday ? (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <input type="number" min="1" max="31" placeholder="Day" value={bDay} onChange={(e) => setBDay(e.target.value)}
              className="w-12 px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-xs text-center focus:outline-none focus:ring-2 focus:ring-amber/30" />
            <select value={bMonth} onChange={(e) => setBMonth(e.target.value)}
              className="px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={bYear} onChange={(e) => setBYear(e.target.value)}
              className="px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-amber/30">
              <option value="">Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={handleSaveBirthday} className="px-3 py-1 rounded-full bg-forest text-white text-xs font-medium">Save</button>
          </div>
        ) : (
          <p className="text-xs text-earth font-medium">{formatBirthday()}</p>
        )}
      </div>

      {/* Active Events */}
      <div className="bg-warm-card rounded-2xl p-4 mb-3 shadow-sm border border-warm-border">
        <h2 className="text-xs font-semibold text-earth-light uppercase tracking-widest mb-2">Events</h2>
        {activeEvents.length === 0 ? (
          <p className="text-xs text-earth-light/70">No upcoming events.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {activeEvents.map((event) => <EventRow key={event.id} event={event} />)}
          </div>
        )}
      </div>

      {/* Archived Events */}
      {archivedEvents.length > 0 && (
        <div className="mb-3">
          <button onClick={() => setShowArchived(!showArchived)}
            className="text-xs text-earth-light/60 hover:text-earth-light transition-colors mb-1.5 px-1">
            {showArchived ? '▾ Hide' : '▸ Show'} archived ({archivedEvents.length})
          </button>
          {showArchived && (
            <div className="bg-warm-card rounded-2xl p-4 shadow-sm border border-warm-border opacity-60">
              <div className="flex flex-col gap-1.5">
                {archivedEvents.map((event) => <EventRow key={event.id} event={event} />)}
              </div>
            </div>
          )}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
