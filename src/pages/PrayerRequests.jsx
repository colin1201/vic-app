import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';
import LinkifyText from '../components/LinkifyText';

const CATEGORIES = ['Career', 'Faith', 'Family', 'Health', 'Relationships', 'Thanksgiving', 'Travel', 'Others'];

export default function PrayerRequests() {
  const navigate = useNavigate();
  const [view, setView] = useState(null);
  const { members, prayerRequests, updatePrayerRequest, addPrayerComment, deletePrayerRequest } = useApp();

  const [filter, setFilter] = useState('Group');
  const [confirmedFilter, setConfirmedFilter] = useState('Group');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const FILTER_PASSCODES = { Guys: 'vicbros', Girls: 'girlpower' };

  const handleFilterClick = (f) => {
    if (f === 'Group') { setFilter('Group'); setConfirmedFilter('Group'); setPasscodeInput(''); setPasscodeError(''); }
    else if (confirmedFilter === f) { setFilter('Group'); setConfirmedFilter('Group'); setPasscodeInput(''); setPasscodeError(''); }
    else { setFilter(f); setConfirmedFilter(null); setPasscodeInput(''); setPasscodeError(''); }
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (passcodeInput === FILTER_PASSCODES[filter]) {
      setConfirmedFilter(filter);
      setPasscodeInput('');
      setPasscodeError('');
    } else {
      setPasscodeError('Wrong passcode. Try again.');
    }
  };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '?';

  // Counts per visibility tab
  const groupCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Group').length;
  const guysCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Guys').length;
  const girlsCount = prayerRequests.filter(p => p.status === 'active' && p.visibility === 'Girls').length;
  const counts = { Group: groupCount, Guys: guysCount, Girls: girlsCount };

  const activeFilter = confirmedFilter || 'Group';
  const needsPasscode = (filter === 'Guys' || filter === 'Girls') && confirmedFilter !== filter;

  // Filter pipeline
  let filtered = prayerRequests.filter(p => {
    if (activeFilter === 'Group') return p.visibility === 'Group';
    if (activeFilter === 'Guys') return p.visibility === 'Guys';
    if (activeFilter === 'Girls') return p.visibility === 'Girls';
    return true;
  });
  if (searchTerm) filtered = filtered.filter(p => p.content.toLowerCase().includes(searchTerm));
  if (categoryFilter) filtered = filtered.filter(p => p.category === categoryFilter);
  if (memberFilter) filtered = filtered.filter(p => p.member_id === memberFilter);

  const activeRequests = filtered.filter(p => p.status === 'active');
  const answeredRequests = filtered.filter(p => p.status === 'answered' || p.status === 'archived');

  // Get unique categories in current data for filter dropdown
  const usedCategories = [...new Set(prayerRequests.map(p => p.category).filter(Boolean))].sort();

  if (view === 'submit') {
    return (
      <div className="min-h-svh px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setView(null)} className="text-earth-light text-sm">←</button>
          <h1 className="font-title text-lg text-earth-dark font-semibold">Submit Request</h1>
        </div>
        <SubmitTab onDone={() => setView(null)} />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-svh px-5 py-5">
      <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-3xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>Prayer Requests</h1>

      {/* + Submit link + Visibility tabs */}
      <div className="flex justify-end mb-2 px-1">
        <button onClick={() => setView('submit')}
          className="text-xs text-amber font-medium hover:text-amber-dark transition-colors">
          + Submit Prayer Request
        </button>
      </div>

      <div className="flex gap-1 mb-2 justify-center">
        {['Group', 'Guys', 'Girls'].map((f) => (
          <button key={f} onClick={() => handleFilterClick(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === f
                ? (f === 'Group' ? 'bg-forest text-white' : 'bg-amber text-white')
                : 'bg-warm-card border border-warm-border text-earth-light'
            }`}>
            {f === 'Group' ? f : `${f} Only`}
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
              activeFilter === f ? 'bg-white/25 text-white' : 'bg-earth-light/10 text-earth-light/60'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Search filters — keyword + category + member */}
      {!needsPasscode && (
        <div className="flex flex-col gap-1.5 mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            placeholder="Search prayer requests..."
            className="w-full px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth placeholder-earth-light/70 focus:outline-none"
          />
          <div className="flex gap-1.5">
          <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth focus:outline-none">
            <option value="">All members</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg bg-warm-bg border border-warm-border text-xs text-earth focus:outline-none">
            <option value="">All categories</option>
            {usedCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          </div>
        </div>
      )}

      {/* Passcode gate */}
      {needsPasscode && (
        <div className="bg-warm-card rounded-xl p-3 mb-3 border border-warm-border text-center">
          <p className="text-[11px] text-earth-light mb-2">Enter the <strong className="text-earth">{filter}</strong> passcode to view.</p>
          <form onSubmit={handlePasscodeSubmit} className="flex flex-col items-center gap-1.5">
            <input
              type="password"
              placeholder="Passcode"
              value={passcodeInput}
              onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(''); }}
              className="w-40 px-3 py-1.5 rounded-full bg-warm-bg border border-warm-border text-center text-xs text-text placeholder-earth-light/50 focus:outline-none focus:ring-2 focus:ring-amber/30"
              autoFocus
            />
            {passcodeError && <p className="text-dusty-pink text-[11px]">{passcodeError}</p>}
            <div className="flex gap-1.5">
              <button type="button" onClick={() => { setFilter('Group'); setConfirmedFilter('Group'); setPasscodeInput(''); setPasscodeError(''); }} className="px-3 py-1 rounded-full bg-warm-bg border border-warm-border text-earth-light text-[11px]">Cancel</button>
              <button type="submit" className="px-4 py-1 rounded-full bg-forest text-white text-[11px] font-medium">Enter</button>
            </div>
          </form>
        </div>
      )}

      {/* Prayer requests list */}
      {!needsPasscode && (
        <>
          {activeRequests.length === 0 && answeredRequests.length === 0 && (
            <p className="text-xs text-earth-light/70 text-center mt-4">No requests.</p>
          )}

          {activeRequests.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                {activeRequests.map((req) => (
                  <PrayerCard key={req.id} req={req} getMemberName={getMemberName} members={members}
                    updatePrayerRequest={updatePrayerRequest} deletePrayerRequest={deletePrayerRequest} />
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
                    {(req.comments || []).length > 0 && (
                      <div className="bg-white px-3 py-2 space-y-1.5">
                        {(req.comments || []).map(c => (
                          <div key={c.id} className="flex gap-1.5">
                            <div className="shrink-0 w-5 h-5 rounded-full bg-earth-light/10 flex items-center justify-center text-[9px] text-earth-light font-bold mt-0.5">
                              {getMemberName(c.member_id).charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-warm-bg rounded-lg px-2 py-1">
                                <span className="text-[11px] font-medium text-earth">{getMemberName(c.member_id)}</span>
                                <p className="text-[11px] text-earth/70 leading-snug">{c.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="bg-white px-3 py-1.5 border-t border-warm-border">
                      <button onClick={() => deletePrayerRequest(req.id)} className="text-[10px] text-dusty-pink hover:text-dusty-pink/80">Delete</button>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}

function PrayerCard({ req, getMemberName, members, updatePrayerRequest, deletePrayerRequest }) {
  const { editPrayerComment } = useApp();
  const [editingContent, setEditingContent] = useState(false);
  const [contentValue, setContentValue] = useState(req.content);
  const [editMemberId, setEditMemberId] = useState(req.member_id);
  const [editCategories, setEditCategories] = useState(req.category ? req.category.split(', ') : []);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentValue, setCommentValue] = useState('');

  const startEditing = () => {
    setContentValue(req.content);
    setEditMemberId(req.member_id);
    setEditCategories(req.category ? req.category.split(', ') : []);
    setEditingContent(true);
  };

  const saveContent = () => {
    if (contentValue.trim()) {
      updatePrayerRequest(req.id, {
        content: contentValue.trim(),
        member_id: editMemberId,
        category: editCategories.join(', '),
      });
    }
    setEditingContent(false);
  };

  const toggleEditCategory = (c) => {
    setEditCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const saveComment = (commentId) => {
    if (commentValue.trim()) {
      editPrayerComment(req.id, commentId, commentValue.trim());
    }
    setEditingCommentId(null);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-forest/20">
      <div className="bg-forest-dark px-3.5 py-3 relative">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="font-bold text-white text-[14px] tracking-wide">{getMemberName(req.member_id)}</span>
          {req.category && req.category.split(', ').map((c, i) => <span key={i} className="text-[10px] text-amber-light/70">#{c}</span>)}
          {req.visibility !== 'Group' && <span className="text-[10px] text-white/40">{req.visibility}</span>}
          <span className="text-[10px] text-white/25 ml-auto flex-shrink-0">{req.created_at}</span>
        </div>
        {editingContent ? (
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
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all ${
                      editCategories.includes(c) ? 'bg-amber text-white' : 'bg-white/10 text-white/50 border border-white/20'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase tracking-wide">Content</label>
              <textarea value={contentValue} onChange={(e) => setContentValue(e.target.value)} rows={3}
                className="w-full px-2 py-1 rounded-lg bg-white/15 text-[12px] text-white placeholder-white/40 border border-white/20 focus:outline-none resize-none mt-0.5" autoFocus />
            </div>
            <div className="flex items-center justify-between">
              <button onClick={() => { deletePrayerRequest(req.id); }} className="text-[10px] text-red-300 hover:text-red-200 font-medium">Delete</button>
              <div className="flex gap-1.5">
                <button onClick={() => { setContentValue(req.content); setEditingContent(false); }} className="text-[10px] text-white/40">Cancel</button>
                <button onClick={saveContent} className="text-[10px] text-white/70 font-medium">Save</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-1">
            <p className="text-[12px] text-white/80 leading-snug flex-1 whitespace-pre-wrap"><LinkifyText text={req.content} className="[&_a]:text-amber-light [&_a]:hover:text-white" /></p>
            <button onClick={startEditing} className="text-earth/50 hover:text-earth/70 shrink-0 mt-0.5 text-[16px]">✎</button>
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
                <div className="shrink-0 w-6 h-6 rounded-full bg-forest/10 flex items-center justify-center text-[10px] text-forest font-bold mt-0.5">
                  {getMemberName(c.member_id).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-warm-bg/50 rounded-lg px-2.5 py-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-earth">{getMemberName(c.member_id)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-earth-light/70">{c.created_at}</span>
                        <button onClick={() => { setEditingCommentId(c.id); setCommentValue(c.content); }} className="text-earth/50 hover:text-earth/70 text-[14px]">✎</button>
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div className="flex flex-col gap-1 mt-0.5">
                        <input type="text" value={commentValue} onChange={(e) => setCommentValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveComment(c.id); }}
                          className="w-full px-2 py-0.5 rounded bg-white border border-warm-border text-xs text-earth focus:outline-none" autoFocus />
                        <div className="flex gap-1.5">
                          <button onClick={() => saveComment(c.id)} className="text-[10px] text-forest font-medium">Save</button>
                          <button onClick={() => setEditingCommentId(null)} className="text-[10px] text-earth-light/70">Cancel</button>
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

  const toggleCategory = (c) => {
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

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
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                categories.includes(c) ? 'bg-forest text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'
              }`}>
              {c}
            </button>
          ))}
        </div>
        {categories.includes('Others') && (
          <input type="text" placeholder="Specify category..." value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)}
            className={`${inputClass} mt-1.5`} />
        )}
      </div>
      <div>
        <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Visibility</label>
        <div className="flex gap-1.5 mt-1">
          {['Group', 'Guys', 'Girls'].map((v) => (
            <button key={v} type="button" onClick={() => setVisibility(v)}
              className={`flex-1 py-1 rounded-full text-[11px] font-medium transition-all ${visibility === v ? 'bg-amber text-white shadow-sm' : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
              {v === 'Group' ? v : `${v} Only`}
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
        className="px-1.5 py-1 rounded-md bg-white border border-forest/20 text-[11px] text-earth focus:outline-none shrink-0">
        <option value="">From...</option>
        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 px-2.5 py-1 rounded-full bg-white border border-forest/20 text-xs text-earth placeholder-earth-light/70 focus:outline-none focus:ring-1 focus:ring-amber/30" />
      <button type="submit" className="text-[11px] text-forest font-medium shrink-0">Post</button>
    </form>
  );
}
