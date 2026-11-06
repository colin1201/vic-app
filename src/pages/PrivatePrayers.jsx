import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';
import LinkifyText from '../components/LinkifyText';
import LockIcon from '../components/LockIcon';

const PASSCODES = { vicbros: 'Guys', girlpower: 'Girls' };
const CATEGORIES = ['Career', 'Faith', 'Family', 'Health', 'Relationships', 'Thanksgiving', 'Travel', 'Others'];

export default function PrivatePrayers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { members, prayerRequests, updatePrayerRequest, addPrayerComment, editPrayerComment, deletePrayerRequest } = useApp();
  const [unlocked, setUnlocked] = useState(() => {
    const fromState = location.state?.unlocked;
    if (fromState) { sessionStorage.setItem('vic_private_type', fromState); return fromState; }
    return null;
  });
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '?';

  const guysCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Guys').length;
  const girlsCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Girls').length;

  const handleUnlock = (e) => {
    e.preventDefault();
    const type = PASSCODES[passcode];
    if (type) { setUnlocked(type); setError(''); setPasscode(''); sessionStorage.setItem('vic_private_type', type); }
    else { setError('Wrong passcode.'); }
  };

  // Clear session when locking
  const handleLock = () => { setUnlocked(null); sessionStorage.removeItem('vic_private_type'); };

  let filtered = prayerRequests.filter(p => p.visibility === unlocked);
  if (dateFilter === '7days') {
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`;
    filtered = filtered.filter(p => p.created_at >= weekAgoStr);
  }
  if (searchTerm) filtered = filtered.filter(p => p.content.toLowerCase().includes(searchTerm));
  if (memberFilter) filtered = filtered.filter(p => p.member_id === memberFilter);
  if (categoryFilter) filtered = filtered.filter(p => p.category?.includes(categoryFilter));

  const active = filtered.filter(p => p.status === 'active');
  const completed = filtered.filter(p => p.status === 'answered' || p.status === 'archived');
  const usedCategories = [...new Set(prayerRequests.filter(p => p.visibility === unlocked).map(p => p.category).filter(Boolean))].sort();

  const headerEmoji = unlocked === 'Guys' ? '👦🏻' : '👧🏻';
  const headerText = unlocked === 'Guys' ? 'Guys Only' : 'Girls Only';
  const pageBg = unlocked === 'Guys' ? 'bg-slate-100' : unlocked === 'Girls' ? 'bg-rose-50' : '';
  const cardBg = unlocked === 'Guys' ? 'bg-slate-600' : '';
  const cardBgStyle = unlocked === 'Girls' ? { backgroundColor: '#b0828e' } : {};
  const cardBorder = unlocked === 'Guys' ? 'border-slate-500/30' : 'border-[#b0828e]/30';
  const accentColor = unlocked === 'Guys' ? 'text-slate-600' : '';
  const accentStyle = unlocked === 'Girls' ? { color: '#b0828e' } : {};
  const focusRing = unlocked === 'Guys' ? 'focus:ring-slate-400/30' : 'focus:ring-[#b0828e]/30';
  const avatarBg = unlocked === 'Guys' ? 'bg-slate-100' : 'bg-rose-50';
  const avatarText = unlocked === 'Guys' ? 'text-slate-600' : '';
  const avatarTextStyle = unlocked === 'Girls' ? { color: '#b0828e' } : {};

  if (!unlocked) {
    return (
      <div className="min-h-svh px-5 py-5">
        <button onClick={() => navigate('/prayer')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
        <h1 className="font-logo text-3xl text-earth-dark text-center mb-6" style={{ fontWeight: 100 }}>Private Prayers</h1>
        <div className="flex flex-col items-center mt-8">
          <p className="text-xs text-earth/70 mb-4 text-center">Enter your passcode to see gender-specific prayers.</p>
          <div className="flex gap-4 mb-6">
            {guysCount > 0 && <span className="text-xs text-earth/70">👦🏻 {guysCount} Active Prayer{guysCount !== 1 ? 's' : ''}</span>}
            {girlsCount > 0 && <span className="text-xs text-earth/70">👧🏻 {girlsCount} Active Prayer{girlsCount !== 1 ? 's' : ''}</span>}
            {guysCount === 0 && girlsCount === 0 && <span className="text-xs text-earth-light/70 italic">No active private prayers</span>}
          </div>
          <form onSubmit={handleUnlock} className="flex flex-col items-center gap-2.5">
            <input type="password" value={passcode} onChange={(e) => { setPasscode(e.target.value); setError(''); }}
              placeholder="Passcode" className="w-48 px-4 py-2 rounded-full bg-warm-card border border-warm-border text-center text-xs text-earth placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30" autoFocus />
            {error && <p className="text-dusty-pink text-xs">{error}</p>}
            <button type="submit" className="px-8 py-2 rounded-full bg-forest text-white font-medium text-xs">Enter</button>
          </form>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`min-h-svh px-5 py-5 ${pageBg}`}>
      {/* Dark overlay feel */}
      <div className="fixed inset-0 bg-black/5 pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('/prayer')} className="text-earth-light text-sm">←</button>
          <button onClick={handleLock} className="text-xs text-earth-light flex items-center gap-1"><LockIcon size={10} /> Lock</button>
        </div>

        {/* Big header */}
        <div className="text-center mb-3">
          <span className="text-4xl">{headerEmoji}</span>
          <h1 className="font-title text-xl text-earth-dark font-bold mt-1">{headerText}</h1>
          <p className="text-[11px] text-earth-light/70 mt-0.5 flex items-center justify-center gap-1"><LockIcon size={10} /> Private prayers — only visible with passcode</p>
        </div>
        <div className="flex justify-end mb-2 px-1">
          <button onClick={() => navigate('/prayer', { state: { openSubmit: true } })}
            className={`text-xs font-medium transition-colors ${unlocked === 'Guys' ? 'text-slate-600 hover:text-slate-700' : 'hover:opacity-80'}`}
            style={unlocked === 'Girls' ? { color: '#b0828e' } : {}}>
            + Submit Prayer Request
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-1.5 mb-3">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            placeholder="Search..." className={`w-full px-2 py-1.5 rounded-lg bg-white/80 border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none ${focusRing}`} />
          <div className="flex gap-1.5">
            <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}
              className={`flex-1 px-2 py-1.5 rounded-lg bg-white/80 border border-warm-border text-xs text-earth focus:outline-none ${focusRing}`}>
              <option value="">All {unlocked === 'Guys' ? 'guys' : 'girls'}</option>
              {members.filter(m => m.gender === (unlocked === 'Guys' ? 'Guy' : 'Girl')).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className={`flex-1 px-2 py-1.5 rounded-lg bg-white/80 border border-warm-border text-xs text-earth focus:outline-none ${focusRing}`}>
              <option value="">All categories</option>
              {usedCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setDateFilter('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${dateFilter === 'all' ? (unlocked === 'Guys' ? 'bg-slate-600 text-white' : 'text-white') : 'bg-white/80 border border-warm-border text-earth-light'}`}
              style={dateFilter === 'all' && unlocked === 'Girls' ? { backgroundColor: '#b0828e' } : {}}>
              Show All
            </button>
            <button onClick={() => setDateFilter('7days')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${dateFilter === '7days' ? (unlocked === 'Guys' ? 'bg-slate-600 text-white' : 'text-white') : 'bg-white/80 border border-warm-border text-earth-light'}`}
              style={dateFilter === '7days' && unlocked === 'Girls' ? { backgroundColor: '#b0828e' } : {}}>
              Past 7 days
            </button>
          </div>
        </div>

        {active.length === 0 && completed.length === 0 && (
          <p className="text-xs text-earth-light/70 text-center mt-4">No private prayers.</p>
        )}

        {active.length > 0 && (
          <div className="flex flex-col gap-2 mb-3">
            {active.map(req => (
              <PrivateCard key={req.id} req={req} getMemberName={getMemberName} members={members}
                updatePrayerRequest={updatePrayerRequest} deletePrayerRequest={deletePrayerRequest}
                cardBg={cardBg} cardBgStyle={cardBgStyle} cardBorder={cardBorder}
                accentColor={accentColor} accentStyle={accentStyle} avatarBg={avatarBg} avatarText={avatarText} avatarTextStyle={avatarTextStyle} />
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <button onClick={() => setShowCompleted(!showCompleted)}
              className="text-xs text-earth-light/60 hover:text-earth-light transition-colors mb-1.5">
              {showCompleted ? '▾ Hide' : '▸ Show'} praise reports ({completed.length})
            </button>
            {showCompleted && (
              <div className="flex flex-col gap-2">
                {completed.map(req => (
                  <div key={req.id} className="rounded-xl overflow-hidden shadow-sm border border-warm-border opacity-50">
                    <div className="bg-earth-light/20 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-earth text-[12px]">{getMemberName(req.member_id)}</span>
                        <span className="text-[10px] text-earth-light/70 ml-auto">{req.created_at}</span>
                      </div>
                      <p className="text-xs text-earth/60 leading-snug">{req.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function PrivateCard({ req, getMemberName, members, updatePrayerRequest, deletePrayerRequest, cardBg, cardBgStyle, cardBorder, accentColor, accentStyle, avatarBg, avatarText, avatarTextStyle }) {
  const { editPrayerComment, addPrayerComment } = useApp();
  const [editing, setEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(req.member_id);
  const [editCategories, setEditCategories] = useState(req.category ? req.category.split(', ') : []);
  const [contentValue, setContentValue] = useState(req.content);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentEditValue, setCommentEditValue] = useState('');
  const [commentMemberId, setCommentMemberId] = useState('');
  const [commentText, setCommentText] = useState('');

  const startEditing = () => {
    setEditMemberId(req.member_id);
    setEditCategories(req.category ? req.category.split(', ') : []);
    setContentValue(req.content);
    setEditing(true);
  };

  const saveEdit = () => {
    if (contentValue.trim()) {
      updatePrayerRequest(req.id, { content: contentValue.trim(), member_id: editMemberId, category: editCategories.join(', ') });
    }
    setEditing(false);
  };

  const toggleEditCategory = (c) => setEditCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const saveComment = (commentId) => {
    if (commentEditValue.trim()) editPrayerComment(req.id, commentId, commentEditValue.trim());
    setEditingCommentId(null);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentMemberId || !commentText.trim()) return;
    addPrayerComment(req.id, { member_id: commentMemberId, content: commentText.trim() });
    setCommentText('');
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border ${cardBorder}`}>
      <div className={`${cardBg} px-3.5 py-3`} style={cardBgStyle || {}}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="font-bold text-white text-[14px]">{getMemberName(req.member_id)}</span>
          {req.category && req.category.split(', ').map((c, i) => <span key={i} className="text-[10px] text-white/50">#{c}</span>)}
          <span className="text-[10px] text-white/25 ml-auto">{req.created_at}</span>
        </div>
        {editing ? (
          <div className="flex flex-col gap-2 mt-1">
            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wide">Posted by</label>
              <select value={editMemberId} onChange={(e) => setEditMemberId(e.target.value)}
                className="w-full px-2 py-1 rounded-lg bg-white/15 text-[12px] text-white border border-white/20 focus:outline-none mt-0.5">
                {members.map(m => <option key={m.id} value={m.id} className="text-earth">{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wide">Category</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => toggleEditCategory(c)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${editCategories.includes(c) ? 'bg-white/30 text-white' : 'bg-white/10 text-white/50 border border-white/20'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={contentValue} onChange={(e) => setContentValue(e.target.value)} rows={3}
              className="w-full px-2 py-1 rounded-lg bg-white/15 text-[12px] text-white border border-white/20 focus:outline-none resize-none" autoFocus />
            <div className="flex items-center justify-between">
              <button onClick={() => deletePrayerRequest(req.id)} className="text-[10px] text-red-300 font-medium">Delete</button>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(false)} className="text-[10px] text-white/40">Cancel</button>
                <button onClick={saveEdit} className="text-[10px] text-white/70 font-medium">Save</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-1">
            <p className="text-[12px] text-white/80 leading-snug flex-1 whitespace-pre-wrap">
              <LinkifyText text={req.content} className="[&_a]:text-white/60 [&_a]:hover:text-white" />
            </p>
            <button onClick={startEditing} className="text-white/30 hover:text-white/60 shrink-0 mt-0.5 text-[16px]">✎</button>
          </div>
        )}
        <div className="flex gap-1.5 mt-2.5">
          <button onClick={() => updatePrayerRequest(req.id, { status: 'answered' })} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15 text-white/70 hover:bg-white/25 transition-colors">Praise Report</button>
        </div>
      </div>
      <div className="bg-white px-3.5 py-2.5">
        {(req.comments || []).length > 0 && (
          <div className="space-y-2 mb-2 max-h-[200px] overflow-y-auto">
            {(req.comments || []).map(c => (
              <div key={c.id} className="flex gap-1.5">
                <div className={`shrink-0 w-6 h-6 rounded-full ${avatarBg} flex items-center justify-center text-[9px] ${avatarText} font-bold mt-0.5`} style={avatarTextStyle}>
                  {getMemberName(c.member_id).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-warm-bg/50 rounded-lg px-2.5 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-earth">{getMemberName(c.member_id)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-earth-light/70">{c.created_at}</span>
                        <button onClick={() => { setEditingCommentId(c.id); setCommentEditValue(c.content); }} className="text-earth/50 hover:text-earth text-[14px]">✎</button>
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div className="flex flex-col gap-1 mt-0.5">
                        <input type="text" value={commentEditValue} onChange={(e) => setCommentEditValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveComment(c.id); }}
                          className="w-full px-2 py-0.5 rounded bg-white border border-warm-border text-xs text-earth focus:outline-none" autoFocus />
                        <div className="flex gap-1.5">
                          <button onClick={() => saveComment(c.id)} className={`text-[10px] ${accentColor} font-medium`} style={accentStyle}>Save</button>
                          <button onClick={() => setEditingCommentId(null)} className="text-[10px] text-earth-light">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-earth/80 leading-snug">{c.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-1.5 mt-1.5">
          <select value={commentMemberId} onChange={(e) => setCommentMemberId(e.target.value)}
            className="px-1.5 py-1 rounded-md bg-white/80 border border-warm-border text-[11px] text-earth focus:outline-none shrink-0">
            <option value="">From...</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..." className="flex-1 px-2.5 py-1 rounded-full bg-white/80 border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none" />
          <button type="submit" className={`text-[11px] ${accentColor} font-medium shrink-0`} style={accentStyle}>Post</button>
        </form>
      </div>
    </div>
  );
}
