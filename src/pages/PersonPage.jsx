import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function PersonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, updateMember, deleteMember, events, addEvent, deleteEvent } = useApp();
  const member = members.find(m => m.id === id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(member?.name || '');

  const [activity, setActivity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [editingBirthday, setEditingBirthday] = useState(false);
  const [bDay, setBDay] = useState(member?.birthday_day || '');
  const [bMonth, setBMonth] = useState(member?.birthday_month || 1);

  if (!member) {
    return <div className="min-h-svh px-5 py-5 flex items-center justify-center"><p className="text-earth-light text-xs">Member not found.</p></div>;
  }

  const memberEvents = events.filter(e => e.member_id === id);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!startDate) return;
    addEvent({ member_id: id, activity: activity || 'Activity', start_date: startDate, end_date: endDate || startDate, availability });
    setActivity(''); setStartDate(''); setEndDate(''); setAvailability('Available');
  };

  const handleSaveBirthday = () => {
    updateMember(id, { birthday_day: Number(bDay), birthday_month: Number(bMonth) });
    setEditingBirthday(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/40 focus:outline-none focus:ring-2 focus:ring-dusty-pink/30";

  return (
    <div className="min-h-svh px-5 py-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/family')} className="text-earth-light text-sm">←</button>
          {editingName ? (
            <div className="flex items-center gap-1.5">
              <input type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && nameValue.trim()) { updateMember(id, { name: nameValue.trim() }); setEditingName(false); } }}
                className="font-title text-xl text-earth-dark font-semibold bg-transparent border-b border-dusty-pink focus:outline-none w-32" autoFocus />
              <button onClick={() => { if (nameValue.trim()) { updateMember(id, { name: nameValue.trim() }); setEditingName(false); } }} className="text-forest text-[10px] font-medium">Save</button>
              <button onClick={() => { setNameValue(member.name); setEditingName(false); }} className="text-earth-light text-[10px]">x</button>
            </div>
          ) : (
            <h1 className="font-title text-xl text-earth-dark font-semibold cursor-pointer" onClick={() => setEditingName(true)}>{member.name}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editingName && <button onClick={() => setEditingName(true)} className="text-[9px] px-2 py-0.5 rounded-full bg-warm-bg border border-warm-border text-earth-light">Edit</button>}
          <button onClick={() => setShowDeleteConfirm(true)} className="text-[9px] px-2 py-0.5 rounded-full bg-dusty-pink-bg border border-dusty-pink-light text-dusty-pink">Delete</button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="bg-warm-card rounded-2xl p-3.5 mb-3 shadow-sm border border-dusty-pink-light text-center">
          <p className="text-[10px] text-earth mb-2">Delete <strong>{member.name}</strong> and all their events?</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-1 rounded-full bg-warm-bg border border-warm-border text-earth-light text-[10px]">Cancel</button>
            <button onClick={() => { deleteMember(id); navigate('/family'); }} className="px-4 py-1 rounded-full bg-dusty-pink text-white text-[10px] font-medium">Yes, delete</button>
          </div>
        </div>
      )}

      {/* Birthday */}
      <div className="bg-warm-card rounded-2xl p-4 mb-3 shadow-sm border border-warm-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest">Birthday</h2>
          <button onClick={() => setEditingBirthday(!editingBirthday)} className="text-dusty-pink text-[10px] font-medium">{editingBirthday ? 'Cancel' : 'Edit'}</button>
        </div>
        {editingBirthday ? (
          <div className="flex items-center gap-2 mt-1.5">
            <input type="number" min="1" max="31" placeholder="Day" value={bDay} onChange={(e) => setBDay(e.target.value)}
              className="w-12 px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-[10px] text-center focus:outline-none focus:ring-2 focus:ring-dusty-pink/30" />
            <select value={bMonth} onChange={(e) => setBMonth(e.target.value)}
              className="px-2 py-1 rounded-lg bg-warm-bg border border-warm-border text-[10px] focus:outline-none focus:ring-2 focus:ring-dusty-pink/30">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <button onClick={handleSaveBirthday} className="px-3 py-1 rounded-full bg-forest text-white text-[10px] font-medium">Save</button>
          </div>
        ) : (
          <p className="text-xs text-earth font-medium">{member.birthday_day ? `${member.birthday_day} ${MONTHS[member.birthday_month - 1]}` : 'Not set'}</p>
        )}
      </div>

      {/* Log Event */}
      <div className="bg-warm-card rounded-2xl p-4 mb-3 shadow-sm border border-warm-border">
        <h2 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest mb-2.5">Log Event</h2>
        <form onSubmit={handleAddEvent} className="flex flex-col gap-2">
          <input type="text" placeholder="Activity (e.g. Holiday)" value={activity} onChange={(e) => setActivity(e.target.value)} className={inputClass} />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[9px] text-earth-light/60 uppercase tracking-wide">From</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-earth-light/60 uppercase tracking-wide">To</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setAvailability('Available')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-medium transition-all ${availability === 'Available' ? 'bg-dusty-pink text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              Available
            </button>
            <button type="button" onClick={() => setAvailability('Unavailable')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-medium transition-all ${availability === 'Unavailable' ? 'bg-earth text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              Unavailable
            </button>
          </div>
          <button type="submit" className="w-full py-1.5 rounded-full bg-forest text-white font-medium text-[11px] hover:bg-forest-dark transition-colors shadow-sm">Submit</button>
        </form>
      </div>

      {/* Events */}
      <div className="bg-warm-card rounded-2xl p-4 shadow-sm border border-warm-border">
        <h2 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest mb-2">Events</h2>
        {memberEvents.length === 0 ? (
          <p className="text-[10px] text-earth-light/50">No events logged yet.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {memberEvents.map((event) => (
              <div key={event.id} className={`flex items-center justify-between px-3 py-1.5 rounded-full text-[10px] ${
                event.availability === 'Available' ? 'bg-dusty-pink-bg border border-dusty-pink-light text-earth' : 'bg-warm-bg border border-warm-border text-earth-light'
              }`}>
                <span>
                  {event.activity} · {formatDate(event.start_date)}
                  {event.end_date !== event.start_date && ` – ${formatDate(event.end_date)}`}
                  <span className={`ml-1 ${event.availability === 'Available' ? 'text-dusty-pink' : 'text-earth-light'}`}> · {event.availability}</span>
                </span>
                <button onClick={() => deleteEvent(event.id)} className="text-earth-light/40 hover:text-dusty-pink ml-2">x</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
