import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';
import LinkifyText from '../components/LinkifyText';
import LockIcon from '../components/LockIcon';

const CATEGORIES = ['Career', 'Faith', 'Family', 'Health', 'Relationships', 'Thanksgiving', 'Travel', 'Others'];

export default function PrayerRequests() {
  const navigate = useNavigate();
  const [view, setView] = useState(null); // null = landing, 'all' = group prayers, 'submit'
  const { members, prayerRequests, updatePrayerRequest, addPrayerComment, editPrayerComment, deletePrayerRequest } = useApp();

  // Passcode popup state
  const [showPasscodePopup, setShowPasscodePopup] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const PASSCODES = { vicbros: 'Guys', girlpower: 'Girls' };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const type = PASSCODES[passcodeInput];
    if (type) {
      setShowPasscodePopup(false);
      setPasscodeInput('');
      setPasscodeError('');
      navigate('/prayer/private', { state: { unlocked: type } });
    } else {
      setPasscodeError('Wrong passcode.');
    }
  };

  // Counts
  const groupActiveCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Group').length;
  const guysCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Guys').length;
  const girlsCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Girls').length;

  // Landing page
  if (!view) {
    return (
      <div className="min-h-svh px-5 py-5">
        <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
        <h1 className="font-logo text-3xl text-earth-dark text-center mb-5" style={{ fontWeight: 100 }}>Prayer Requests</h1>

        <div className="flex-1 flex flex-col items-center justify-center mt-10">
          <p className="font-accent text-[15px] italic text-earth-light text-center max-w-[260px] leading-relaxed mb-2">
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
          </p>
          <span className="text-xs text-earth-light/55 tracking-[0.2em] uppercase font-body mb-14">
            Philippians 4:6-7
          </span>

          <div className="flex flex-col items-center gap-3 w-full max-w-[260px]">
            {/* Group button */}
            <button onClick={() => setView('all')}
              className="w-full py-2.5 rounded-full bg-forest text-white font-medium text-[13px] shadow-sm hover:bg-forest-dark transition-colors flex items-center justify-center gap-2">
              Group Prayer Requests
              {groupActiveCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[9px] font-bold">{groupActiveCount}</span>
              )}
            </button>

            {/* Private button */}
            <button onClick={() => setShowPasscodePopup(true)}
              className="w-full py-2.5 rounded-full bg-amber text-white font-medium text-[13px] shadow-sm hover:bg-amber-dark transition-colors flex items-center justify-center gap-2">
              <LockIcon size={12} />
              Private Prayer Requests
              {(guysCount > 0 || girlsCount > 0) && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
                  {guysCount > 0 && <span>👦🏻{guysCount}</span>}
                  {girlsCount > 0 && <span>👧🏻{girlsCount}</span>}
                </span>
              )}
            </button>

            {/* Submit */}
            <button onClick={() => setView('submit')}
              className="text-xs text-amber font-medium hover:text-amber-dark transition-colors mt-2">
              + Submit Prayer Request
            </button>
          </div>
        </div>

        {/* Passcode popup */}
        {showPasscodePopup && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => { setShowPasscodePopup(false); setPasscodeInput(''); setPasscodeError(''); }} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-warm-card rounded-2xl shadow-xl border border-warm-border p-5 w-[280px] text-center">
              <h3 className="text-sm text-earth-dark font-medium mb-1">Private Prayers</h3>
              <p className="text-[11px] text-earth-light/70 mb-3">Enter your passcode to see gender-specific prayers.</p>

              {/* Indicators */}
              <div className="flex justify-center gap-3 mb-4">
                {guysCount > 0 && <span className="text-[11px] text-earth/70">👦🏻 {guysCount} Active</span>}
                {girlsCount > 0 && <span className="text-[11px] text-earth/70">👧🏻 {girlsCount} Active</span>}
              </div>

              <form onSubmit={handlePasscodeSubmit} className="flex flex-col items-center gap-2">
                <input type="password" value={passcodeInput}
                  onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(''); }}
                  placeholder="Passcode"
                  className="w-48 px-4 py-2 rounded-full bg-warm-bg border border-warm-border text-center text-xs text-earth placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30" autoFocus />
                {passcodeError && <p className="text-dusty-pink text-[11px]">{passcodeError}</p>}
                <button type="submit" className="px-8 py-2 rounded-full bg-forest text-white font-medium text-xs">Enter</button>
              </form>
            </div>
          </>
        )}

        <BottomNav />
      </div>
    );
  }

  if (view === 'submit') {
    return (
      <div className="min-h-svh px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setView('all')} className="text-earth-light text-sm">←</button>
          <h1 className="font-title text-lg text-earth-dark font-semibold">Submit Request</h1>
        </div>
        <SubmitTab onDone={() => setView('all')} />
        <BottomNav />
      </div>
    );
  }

  // "All VIC" view — group prayers only
  return <GroupPrayers
    setView={setView}
    navigate={navigate}
    members={members}
    prayerRequests={prayerRequests}
    updatePrayerRequest={updatePrayerRequest}
    deletePrayerRequest={deletePrayerRequest}
  />;
}

function GroupPrayers({ setView, navigate, members, prayerRequests, updatePrayerRequest, deletePrayerRequest }) {
  const { editPrayerComment, addPrayerComment } = useApp();
  const [showCompleted, setShowCompleted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '?';

  let filtered = prayerRequests.filter(p => p.visibility === 'Group');

  if (dateFilter === '7days') {
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const weekAgoStr = `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}-${String(weekAgo.getDate()).padStart(2, '0')}`;
    filtered = filtered.filter(p => p.created_at >= weekAgoStr);
  }
  if (searchTerm) filtered = filtered.filter(p => p.content.toLowerCase().includes(searchTerm));
  if (categoryFilter) filtered = filtered.filter(p => p.category?.includes(categoryFilter));
  if (memberFilter === 'all_guys') {
    const guyIds = members.filter(m => m.gender === 'Guy').map(m => m.id);
    filtered = filtered.filter(p => guyIds.includes(p.member_id));
  } else if (memberFilter === 'all_girls') {
    const girlIds = members.filter(m => m.gender === 'Girl').map(m => m.id);
    filtered = filtered.filter(p => girlIds.includes(p.member_id));
  } else if (memberFilter) {
    filtered = filtered.filter(p => p.member_id === memberFilter);
  }

  const activeRequests = filtered.filter(p => p.status === 'active');
  const answeredRequests = filtered.filter(p => p.status === 'answered' || p.status === 'archived');
  const usedCategories = [...new Set(prayerRequests.filter(p => p.visibility === 'Group').map(p => p.category).filter(Boolean))].sort();

  return (
    <div className="min-h-svh px-5 py-5">
      <button onClick={() => setView(null)} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-2xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>All VIC Prayers</h1>

      <div className="flex justify-end mb-2 px-1">
        <button onClick={() => setView('submit')}
          className="text-xs text-amber font-medium hover:text-amber-dark transition-colors">
          + Submit Prayer Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-1.5 mb-3">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          placeholder="Search prayer requests..."
          className="w-full px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none" />
        <div className="flex gap-1.5">
          <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth focus:outline-none">
            <option value="">All members</option>
            <option value="all_guys">All Guys</option>
            <option value="all_girls">All Girls</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth focus:outline-none">
            <option value="">All categories</option>
            {usedCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setDateFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${dateFilter === 'all' ? 'bg-forest text-white' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
            Show All
          </button>
          <button onClick={() => setDateFilter('7days')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${dateFilter === '7days' ? 'bg-forest text-white' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
            Past 7 days
          </button>
        </div>
      </div>

      {activeRequests.length === 0 && answeredRequests.length === 0 && (
        <p className="text-xs text-earth-light/70 text-center mt-4">No requests.</p>
      )}

      {activeRequests.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
            {activeRequests.map((req) => (
              <PrayerCard key={req.id} req={req} getMemberName={getMemberName} members={members}
                updatePrayerRequest={updatePrayerRequest} deletePrayerRequest={deletePrayerRequest} cardColor="forest" />
            ))}
          </div>
        </div>
      )}

      {answeredRequests.length > 0 && (
        <div>
          <button onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs text-earth-light/60 hover:text-earth-light transition-colors mb-1.5 px-0.5">
            {showCompleted ? '▾ Hide' : '▸ Show'} praise reports ({answeredRequests.length})
          </button>
          {showCompleted && <div className="flex flex-col gap-2">
            {answeredRequests.map((req) => (
              <div key={req.id} className="rounded-xl overflow-hidden shadow-sm border border-warm-border opacity-50">
                <div className="bg-earth-light/20 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-earth text-[12px]">{getMemberName(req.member_id)}</span>
                    {req.category && req.category.split(', ').map((c, i) => <span key={i} className="text-[10px] text-amber/60 mr-1">#{c}</span>)}
                    <span className="text-[10px] text-earth-light/70 ml-auto">{req.created_at}</span>
                  </div>
                  <p className="text-xs text-earth/60 leading-snug">{req.content}</p>
                </div>
              </div>
            ))}
          </div>}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function PrayerCard({ req, getMemberName, members, updatePrayerRequest, deletePrayerRequest, cardColor = 'forest' }) {
  const { editPrayerComment, addPrayerComment } = useApp();
  const [editingContent, setEditingContent] = useState(false);
  const [contentValue, setContentValue] = useState(req.content);
  const [editMemberId, setEditMemberId] = useState(req.member_id);
  const [editCategories, setEditCategories] = useState(req.category ? req.category.split(', ') : []);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentValue, setCommentValue] = useState('');

  const cardBg = cardColor === 'forest' ? 'bg-forest-dark' : cardColor === 'blue' ? 'bg-blue-800' : 'bg-rose-400';
  const cardBorder = cardColor === 'forest' ? 'border-forest/20' : cardColor === 'blue' ? 'border-blue-700/30' : 'border-rose-300/30';

  const startEditing = () => { setContentValue(req.content); setEditMemberId(req.member_id); setEditCategories(req.category ? req.category.split(', ') : []); setEditingContent(true); };
  const saveContent = () => {
    if (contentValue.trim()) updatePrayerRequest(req.id, { content: contentValue.trim(), member_id: editMemberId, category: editCategories.join(', ') });
    setEditingContent(false);
  };
  const toggleEditCategory = (c) => setEditCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const saveComment = (commentId) => { if (commentValue.trim()) editPrayerComment(req.id, commentId, commentValue.trim()); setEditingCommentId(null); };

  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border ${cardBorder}`}>
      <div className={`${cardBg} px-3.5 py-3 relative`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="font-bold text-white text-[14px] tracking-wide">{getMemberName(req.member_id)}</span>
          {req.category && req.category.split(', ').map((c, i) => <span key={i} className="text-[10px] text-amber-light/70">#{c}</span>)}
          <span className="text-[10px] text-white/25 ml-auto flex-shrink-0">{req.created_at}</span>
        </div>
        {editingContent ? (
          <div className="flex flex-col gap-2 mt-1">
            <select value={editMemberId} onChange={(e) => setEditMemberId(e.target.value)}
              className="w-full px-2 py-1 rounded-lg bg-white/15 text-[12px] text-white border border-white/20 focus:outline-none">
              {members.map(m => <option key={m.id} value={m.id} className="text-earth">{m.name}</option>)}
            </select>
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => toggleEditCategory(c)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${editCategories.includes(c) ? 'bg-amber text-white' : 'bg-white/10 text-white/50 border border-white/20'}`}>
                  {c}
                </button>
              ))}
            </div>
            <textarea value={contentValue} onChange={(e) => setContentValue(e.target.value)} rows={3}
              className="w-full px-2 py-1 rounded-lg bg-white/15 text-[12px] text-white border border-white/20 focus:outline-none resize-none" autoFocus />
            <div className="flex items-center justify-between">
              <button onClick={() => deletePrayerRequest(req.id)} className="text-[10px] text-red-300 font-medium">Delete</button>
              <div className="flex gap-1.5">
                <button onClick={() => setEditingContent(false)} className="text-[10px] text-white/40">Cancel</button>
                <button onClick={saveContent} className="text-[10px] text-white/70 font-medium">Save</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-1">
            <p className="text-[12px] text-white/80 leading-snug flex-1 whitespace-pre-wrap"><LinkifyText text={req.content} className="[&_a]:text-amber-light [&_a]:hover:text-white" /></p>
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
                <div className="shrink-0 w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center text-[9px] text-forest font-bold mt-0.5">
                  {getMemberName(c.member_id).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-warm-bg/50 rounded-lg px-2.5 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-earth">{getMemberName(c.member_id)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-earth-light/70">{c.created_at}</span>
                        <button onClick={() => { setEditingCommentId(c.id); setCommentValue(c.content); }} className="text-earth/50 hover:text-earth text-[14px]">✎</button>
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div className="flex flex-col gap-1 mt-0.5">
                        <input type="text" value={commentValue} onChange={(e) => setCommentValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveComment(c.id); }}
                          className="w-full px-2 py-0.5 rounded bg-white border border-warm-border text-xs text-earth focus:outline-none" autoFocus />
                        <div className="flex gap-1.5">
                          <button onClick={() => saveComment(c.id)} className="text-[10px] text-forest font-medium">Save</button>
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
        <CommentSection requestId={req.id} members={members} />
      </div>
    </div>
  );
}

function SubmitTab({ onDone }) {
  const { members, addPrayerRequest } = useApp();
  const [memberId, setMemberId] = useState('');
  const [visibility, setVisibility] = useState('Group');
  const [categories, setCategories] = useState([]);
  const [otherCategory, setOtherCategory] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (c) => setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !content.trim()) return;
    const finalCats = categories.map(c => c === 'Others' ? (otherCategory.trim() || 'Others') : c);
    addPrayerRequest({ member_id: memberId, visibility, category: finalCats.join(', '), content: content.trim() });
    setMemberId(''); setVisibility('Group'); setCategories([]); setOtherCategory(''); setContent('');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onDone(); }, 1200);
  };

  const inputClass = "w-full px-3 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30";

  return (
    <form onSubmit={handleSubmit} className="bg-warm-card rounded-2xl p-3.5 shadow-sm border border-warm-border flex flex-col gap-2.5">
      <div>
        <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Name</label>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className={inputClass}>
          <option value="">Select...</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Category</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {CATEGORIES.map(c => (
            <button key={c} type="button" onClick={() => toggleCategory(c)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all ${categories.includes(c) ? 'bg-forest text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              {c}
            </button>
          ))}
        </div>
        {categories.includes('Others') && (
          <input type="text" placeholder="Specify category..." value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)} className={`${inputClass} mt-1.5`} />
        )}
      </div>
      <div>
        <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Visibility</label>
        <div className="flex gap-1.5 mt-1">
          {[
            { value: 'Group', label: 'All VIC' },
            { value: 'Guys', label: '[Private] Guys Only' },
            { value: 'Girls', label: '[Private] Girls Only' },
          ].map((v) => (
            <button key={v.value} type="button" onClick={() => setVisibility(v.value)}
              className={`flex-1 py-1 rounded-full text-[10px] font-medium transition-all ${visibility === v.value ? (v.value === 'Group' ? 'bg-forest text-white shadow-sm' : 'bg-amber text-white shadow-sm') : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Prayer Request</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Share your prayer request..." className={`${inputClass} resize-none`} />
      </div>
      <button type="submit" className="w-full py-1.5 rounded-full bg-forest text-white font-medium text-xs hover:bg-forest-dark transition-colors shadow-sm">Submit</button>
      {submitted && <p className="text-center text-amber text-[11px] font-medium">Submitted! Redirecting...</p>}
    </form>
  );
}

function CommentSection({ requestId, members }) {
  const { addPrayerComment } = useApp();
  const [commentMemberId, setCommentMemberId] = useState('');
  const [commentText, setCommentText] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentMemberId || !commentText.trim()) return;
    addPrayerComment(requestId, { member_id: commentMemberId, content: commentText.trim() });
    setCommentText('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-1.5">
      <select value={commentMemberId} onChange={(e) => setCommentMemberId(e.target.value)}
        className="px-1.5 py-1 rounded-md bg-warm-bg border border-warm-border text-[11px] text-earth focus:outline-none shrink-0">
        <option value="">From...</option>
        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..." className="flex-1 px-2.5 py-1 rounded-full bg-warm-bg border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none" />
      <button type="submit" className="text-[11px] text-forest font-medium shrink-0">Post</button>
    </form>
  );
}
