import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

export default function PrayerRequests() {
  const navigate = useNavigate();
  const [view, setView] = useState(null); // null = landing, 'view', 'submit'

  if (!view) {
    return (
      <div className="min-h-svh px-5 py-5">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate('/')} className="text-earth-light text-sm">←</button>
          <h1 className="font-title text-xl text-earth-dark font-semibold">Prayer Requests</h1>
        </div>
        <div className="flex flex-col items-center gap-2.5 mt-16">
          <button onClick={() => setView('view')} className="px-8 py-2.5 rounded-full bg-forest text-white font-medium text-[11px] shadow-sm hover:bg-forest-dark transition-colors">
            View Prayer Requests
          </button>
          <button onClick={() => setView('submit')} className="px-8 py-2.5 rounded-full bg-[#B8897F] text-white font-medium text-[11px] shadow-sm hover:bg-[#A67B71] transition-colors">
            Submit Prayer Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setView(null)} className="text-earth-light text-sm">←</button>
        <h1 className="font-title text-lg text-earth-dark font-semibold">{view === 'submit' ? 'Submit Request' : 'Prayer Requests'}</h1>
      </div>
      {view === 'submit' ? <SubmitTab onDone={() => setView('view')} /> : <ViewTab />}
    </div>
  );
}

function SubmitTab({ onDone }) {
  const { members, addPrayerRequest } = useApp();
  const [memberId, setMemberId] = useState('');
  const [visibility, setVisibility] = useState('Group');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !content.trim()) return;
    addPrayerRequest({ member_id: memberId, visibility, content: content.trim() });
    setMemberId(''); setVisibility('Group'); setContent('');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onDone(); }, 1200);
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/40 focus:outline-none focus:ring-2 focus:ring-dusty-pink/30";

  return (
    <form onSubmit={handleSubmit} className="bg-warm-card rounded-2xl p-3.5 shadow-sm border border-warm-border flex flex-col gap-2.5">
      <div>
        <label className="text-[9px] text-earth-light/60 uppercase tracking-wide">Name</label>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className={inputClass}>
          <option value="">Select...</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[9px] text-earth-light/60 uppercase tracking-wide">Visibility</label>
        <div className="flex gap-1.5 mt-1">
          {['Group', 'Guys', 'Girls'].map((v) => (
            <button key={v} type="button" onClick={() => setVisibility(v)}
              className={`flex-1 py-1 rounded-full text-[9px] font-medium transition-all ${visibility === v ? 'bg-dusty-pink text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              {v === 'Group' ? v : `${v} Only`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[9px] text-earth-light/60 uppercase tracking-wide">Prayer Request</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Share your prayer request..." className={`${inputClass} resize-none`} />
      </div>
      <button type="submit" className="w-full py-1.5 rounded-full bg-forest text-white font-medium text-[10px] hover:bg-forest-dark transition-colors shadow-sm">Submit</button>
      {submitted && <p className="text-center text-dusty-pink text-[9px] font-medium">Submitted! Redirecting...</p>}
    </form>
  );
}

function ViewTab() {
  const { members, prayerRequests, updatePrayerRequest, deletePrayerRequest } = useApp();
  const [filter, setFilter] = useState('Group');
  const [confirmedFilter, setConfirmedFilter] = useState(null);

  const handleFilterClick = (f) => {
    if (f === 'Group') { setFilter('Group'); setConfirmedFilter('Group'); }
    else if (confirmedFilter === f) { setFilter('Group'); setConfirmedFilter('Group'); }
    else { setFilter(f); setConfirmedFilter(null); }
  };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '?';

  const activeFilter = confirmedFilter || 'Group';
  const filtered = prayerRequests.filter(p => {
    if (activeFilter === 'Group') return p.visibility === 'Group';
    if (activeFilter === 'Guys') return p.visibility === 'Guys' || p.visibility === 'Group';
    if (activeFilter === 'Girls') return p.visibility === 'Girls' || p.visibility === 'Group';
    return true;
  });

  const activeRequests = filtered.filter(p => p.status === 'active');
  const answeredRequests = filtered.filter(p => p.status === 'answered' || p.status === 'archived');
  const needsConfirmation = (filter === 'Guys' || filter === 'Girls') && confirmedFilter !== filter;

  return (
    <div>
      <div className="flex gap-1 mb-2.5 justify-center">
        {['Group', 'Guys', 'Girls'].map((f) => (
          <button key={f} onClick={() => handleFilterClick(f)}
            className={`px-3 py-1 rounded-full text-[9px] font-medium transition-all ${activeFilter === f ? 'bg-dusty-pink text-white' : 'bg-warm-card border border-warm-border text-earth-light'}`}>
            {f === 'Group' ? f : `${f} Only`}
          </button>
        ))}
      </div>

      {needsConfirmation && (
        <div className="bg-warm-card rounded-xl p-2.5 mb-2 border border-warm-border text-center">
          <p className="text-[9px] text-earth-light mb-1.5">This section is for <strong className="text-earth">{filter} only</strong>.</p>
          <div className="flex gap-1.5 justify-center">
            <button onClick={() => { setFilter('Group'); setConfirmedFilter(null); }} className="px-3 py-0.5 rounded-full bg-warm-bg border border-warm-border text-earth-light text-[9px]">Cancel</button>
            <button onClick={() => setConfirmedFilter(filter)} className="px-3 py-0.5 rounded-full bg-forest text-white text-[9px] font-medium">Yes, I'm sure</button>
          </div>
        </div>
      )}

      {activeRequests.length === 0 && answeredRequests.length === 0 && (
        <p className="text-[9px] text-earth-light/50 text-center mt-4">No requests.</p>
      )}

      {activeRequests.length > 0 && (
        <div className="mb-2">
          <h2 className="text-[9px] font-semibold text-earth-light uppercase tracking-widest mb-1 px-0.5">Active</h2>
          <div className="flex flex-col gap-1">
            {activeRequests.map((req) => (
              <div key={req.id} className="bg-warm-card rounded-lg px-2.5 py-1.5 border border-warm-border flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-earth text-[10px]">{getMemberName(req.member_id)}</span>
                    {req.visibility !== 'Group' && <span className="text-[8px] text-dusty-pink">{req.visibility}</span>}
                    <span className="text-[8px] text-earth-light/40 ml-auto flex-shrink-0">{req.created_at}</span>
                  </div>
                  <p className="text-[10px] text-earth/70 leading-snug">{req.content}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0 pt-0.5">
                  <button onClick={() => updatePrayerRequest(req.id, { status: 'answered' })} className="text-[8px] px-1.5 py-px rounded-full bg-forest/10 text-forest whitespace-nowrap">Mark as Completed</button>
                  <button onClick={() => deletePrayerRequest(req.id)} className="text-[8px] px-1.5 py-px rounded-full bg-dusty-pink-bg text-dusty-pink">x</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {answeredRequests.length > 0 && (
        <div>
          <h2 className="text-[9px] font-semibold text-earth-light uppercase tracking-widest mb-1 px-0.5">Completed</h2>
          <div className="flex flex-col gap-1">
            {answeredRequests.map((req) => (
              <div key={req.id} className="bg-warm-card rounded-lg px-2.5 py-1.5 border border-warm-border opacity-45 flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-earth text-[10px]">{getMemberName(req.member_id)}</span>
                    <span className="text-[8px] text-earth-light/40 ml-auto">{req.created_at}</span>
                  </div>
                  <p className="text-[10px] text-earth/70 leading-snug">{req.content}</p>
                </div>
                <button onClick={() => deletePrayerRequest(req.id)} className="text-[8px] px-1.5 py-px rounded-full bg-dusty-pink-bg text-dusty-pink flex-shrink-0 pt-0.5">x</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
