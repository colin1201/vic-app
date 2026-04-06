import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import { supabase } from '../data/supabase';
import BottomNav from '../components/BottomNav';
import LinkifyText from '../components/LinkifyText';

const PRIORITY_OPTIONS = ['Urgent', 'Important', 'FYI'];
const PRIORITY_COLORS = {
  Urgent: 'bg-red-700 text-white',
  Important: 'bg-amber text-white',
  FYI: 'bg-earth-light/20 text-earth',
};

async function uploadImage(file) {
  const ext = file.name.split('.').pop();
  const name = `${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from('posts').upload(name, file);
  if (error) { console.error('Upload error:', error); return null; }
  const { data: urlData } = supabase.storage.from('posts').getPublicUrl(name);
  return urlData.publicUrl;
}

export default function Posts() {
  const navigate = useNavigate();
  const { members, announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('FYI');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMemberId, setEditMemberId] = useState('');
  const [editPriority, setEditPriority] = useState('FYI');
  const [showArchived, setShowArchived] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const fileRef = useRef(null);

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '?';

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setPhotos(prev => [...prev, ...urls]);
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!memberId || !content.trim()) return;
    addAnnouncement({ member_id: memberId, title: title.trim(), content: content.trim(), priority, photos });
    setMemberId(''); setTitle(''); setContent(''); setPriority('FYI'); setPhotos([]);
    setShowForm(false);
  };

  const handleSaveEdit = (id) => {
    if (editContent.trim()) {
      updateAnnouncement(id, { title: editTitle.trim(), content: editContent.trim(), member_id: editMemberId, priority: editPriority });
    }
    setEditingId(null);
  };

  const activeAnns = announcements.filter(a => a.status !== 'completed');
  const archivedAnns = announcements.filter(a => a.status === 'completed');

  // All photos from all active posts for the gallery
  const allPhotos = activeAnns.flatMap(a => a.photos || []).filter(Boolean);

  const sorted = [...activeAnns].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.created_at.localeCompare(a.created_at);
  });

  const inputClass = "w-full px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30";

  return (
    <div className="min-h-svh px-5 py-5">
      <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-3xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>Posts</h1>

      {/* Photo gallery at top */}
      {allPhotos.length > 0 && (
        <div className="flex justify-center items-end gap-2 mb-5">
          {allPhotos.length >= 2 && (
            <img src={allPhotos[allPhotos.length > 2 ? allPhotos.length - 3 : 0]} alt=""
              onClick={() => setGalleryIndex(allPhotos.length > 2 ? allPhotos.length - 3 : 0)}
              className="w-16 h-16 rounded-lg object-cover opacity-60 shadow-sm cursor-pointer hover:opacity-80 transition-opacity -mr-2 relative z-0" />
          )}
          <img src={allPhotos[allPhotos.length > 1 ? allPhotos.length - 2 : 0]} alt=""
            onClick={() => setGalleryIndex(allPhotos.length > 1 ? allPhotos.length - 2 : 0)}
            className="w-24 h-24 rounded-xl object-cover shadow-md cursor-pointer hover:shadow-lg transition-shadow relative z-10" />
          {allPhotos.length >= 3 && (
            <img src={allPhotos[allPhotos.length - 1]} alt=""
              onClick={() => setGalleryIndex(allPhotos.length - 1)}
              className="w-16 h-16 rounded-lg object-cover opacity-60 shadow-sm cursor-pointer hover:opacity-80 transition-opacity -ml-2 relative z-0" />
          )}
        </div>
      )}

      {/* Gallery lightbox */}
      {galleryIndex !== null && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setGalleryIndex(null)} />
          <div className="fixed inset-4 z-50 flex items-center justify-center">
            <img src={allPhotos[galleryIndex]} alt="" className="max-w-full max-h-full rounded-xl shadow-xl object-contain" />
            <button onClick={() => setGalleryIndex(null)} className="absolute top-2 right-2 text-white/70 text-xl">✕</button>
            {galleryIndex > 0 && (
              <button onClick={() => setGalleryIndex(galleryIndex - 1)} className="absolute left-2 text-white/70 text-2xl">‹</button>
            )}
            {galleryIndex < allPhotos.length - 1 && (
              <button onClick={() => setGalleryIndex(galleryIndex + 1)} className="absolute right-2 text-white/70 text-2xl">›</button>
            )}
          </div>
        </>
      )}

      {/* Post button */}
      <div className="flex justify-end mb-3 px-1">
        <button onClick={() => setShowForm(!showForm)}
          className="text-[13px] text-amber font-medium hover:text-amber-dark transition-colors">
          + New Post
        </button>
      </div>

      {/* Submit form */}
      {showForm && (
        <div className="bg-warm-card rounded-2xl p-3.5 mb-4 shadow-sm border border-warm-border">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <div>
              <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Posted by</label>
              <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className={inputClass}>
                <option value="">Select...</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Priority</label>
              <div className="flex gap-1.5 mt-1">
                {PRIORITY_OPTIONS.map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)}
                    className={`flex-1 py-1 rounded-full text-[11px] font-medium transition-all ${priority === p ? PRIORITY_COLORS[p] : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Title (optional)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Venue change this Saturday"
                className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Message</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Write your post..."
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Photos</label>
              <input type="file" ref={fileRef} accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
              <div className="flex items-center gap-2 mt-1">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="px-3 py-1 rounded-full bg-warm-bg border border-warm-border text-earth-light text-[11px]">
                  {uploading ? 'Uploading...' : '+ Add Photos'}
                </button>
                {photos.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-dusty-pink text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-1.5 rounded-full bg-forest text-white font-medium text-xs hover:bg-forest-dark transition-colors shadow-sm">Post</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 rounded-full bg-warm-bg border border-warm-border text-earth-light text-xs">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Active posts */}
      {sorted.length === 0 && archivedAnns.length === 0 && (
        <p className="text-xs text-earth-light/70 text-center mt-8">No posts yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map(ann => (
          <div key={ann.id} className={`bg-warm-card rounded-2xl shadow-sm border overflow-hidden ${ann.pinned ? 'border-forest/30' : 'border-warm-border'}`}>
            {ann.pinned && (
              <div className="bg-forest-dark px-3.5 py-1">
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-widest">Pinned</span>
              </div>
            )}

            <div className="px-3.5 py-3">
              {editingId === ann.id ? (
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Posted by</label>
                    <select value={editMemberId} onChange={(e) => setEditMemberId(e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-earth-light/60 uppercase tracking-wide">Priority</label>
                    <div className="flex gap-1.5 mt-1">
                      {PRIORITY_OPTIONS.map(p => (
                        <button key={p} type="button" onClick={() => setEditPriority(p)}
                          className={`flex-1 py-1 rounded-full text-[11px] font-medium transition-all ${editPriority === p ? PRIORITY_COLORS[p] : 'bg-warm-bg border border-warm-border text-earth-light'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title (optional)"
                    className={inputClass} />
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3}
                    className={`${inputClass} resize-none`} />
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSaveEdit(ann.id)} className="text-[11px] text-forest font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-[11px] text-earth-light">Cancel</button>
                    <button onClick={() => { deleteAnnouncement(ann.id); setEditingId(null); }} className="text-[11px] text-red-600 ml-auto">Delete this post</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-earth text-[13px]">{getMemberName(ann.member_id)}</span>
                    {ann.priority && ann.priority !== 'FYI' && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[ann.priority] || ''}`}>{ann.priority}</span>
                    )}
                    <button onClick={() => updateAnnouncement(ann.id, { pinned: !ann.pinned })}
                      className={`text-xs transition-colors ${ann.pinned ? 'text-forest' : 'text-earth-light/60 hover:text-earth-light'}`}>📌</button>
                    <span className="text-[10px] text-earth-light/70 ml-auto">{ann.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {ann.title && (
                      <h3 className="font-medium text-earth-dark text-[13px]">{ann.title}</h3>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <button onClick={() => { setEditingId(ann.id); setEditTitle(ann.title || ''); setEditContent(ann.content); setEditMemberId(ann.member_id); setEditPriority(ann.priority || 'FYI'); }}
                        className="text-earth/50 hover:text-earth-light text-[14px]">✎</button>
                    </div>
                  </div>
                  <p className="text-[12px] text-earth/70 leading-relaxed whitespace-pre-wrap">
                    <LinkifyText text={ann.content} />
                  </p>

                  {/* Post photos */}
                  {(ann.photos || []).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {ann.photos.map((url, i) => (
                        <img key={i} src={url} alt="" onClick={() => {
                          const idx = allPhotos.indexOf(url);
                          if (idx !== -1) setGalleryIndex(idx);
                        }}
                          className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:shadow-md transition-shadow" />
                      ))}
                    </div>
                  )}

                  <div className="mt-2">
                    <button onClick={() => updateAnnouncement(ann.id, { status: 'completed', pinned: false })}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-medium">Mark as Completed</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Archived */}
      {archivedAnns.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setShowArchived(!showArchived)}
            className="text-xs text-earth-light/60 hover:text-earth-light transition-colors mb-1.5 px-0.5">
            {showArchived ? '▾ Hide' : '▸ Show'} completed ({archivedAnns.length})
          </button>
          {showArchived && (
            <div className="flex flex-col gap-2">
              {archivedAnns.map(ann => (
                <div key={ann.id} className="bg-warm-card rounded-2xl shadow-sm border border-warm-border overflow-hidden opacity-50">
                  <div className="px-3.5 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-earth text-[12px]">{getMemberName(ann.member_id)}</span>
                      <span className="text-[10px] text-earth-light/70 ml-auto">{ann.created_at}</span>
                    </div>
                    {ann.title && <h3 className="font-medium text-earth-dark text-[12px] mb-0.5">{ann.title}</h3>}
                    <p className="text-xs text-earth/60 leading-relaxed whitespace-pre-wrap">
                      <LinkifyText text={ann.content} />
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => updateAnnouncement(ann.id, { status: 'active' })}
                        className="text-[10px] text-forest">Restore</button>
                      <button onClick={() => deleteAnnouncement(ann.id)}
                        className="text-[10px] text-dusty-pink/70 hover:text-dusty-pink ml-auto">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
