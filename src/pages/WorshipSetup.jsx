import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function WorshipSetup() {
  const navigate = useNavigate();
  const { setlists, addSetlist, updateSetlist, deleteSetlist, savedSongs, saveSong, updateSavedSong, deleteSavedSong } = useApp();

  const [date, setDate] = useState('');
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [onlineResults, setOnlineResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [fetchingLyrics, setFetchingLyrics] = useState(false);
  const [editingSetlistId, setEditingSetlistId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualLyrics, setManualLyrics] = useState('');
  const [editingSavedSong, setEditingSavedSong] = useState(null);
  const [previewSong, setPreviewSong] = useState(null);
  const [showSavedSongs, setShowSavedSongs] = useState(false);

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleQueryChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setLocalResults([]);
      setOnlineResults([]);
    }
  };

  // Search both saved and online at the same time
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toLowerCase();
    // Local results
    setLocalResults(savedSongs.filter(s =>
      s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    ));
    // Online results
    setSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=10`);
      const data = await res.json();
      const results = (data.results || []).map(r => ({ artist: r.artistName, title: r.trackName }));
      const unique = results.filter((r, i, arr) => arr.findIndex(x => x.artist === r.artist && x.title === r.title) === i);
      setOnlineResults(unique);
    } catch { setOnlineResults([]); }
    setSearching(false);
  };

  const handleAddFromLibrary = (song) => {
    setSongs(prev => [...prev, { artist: song.artist, title: song.title, lyrics: song.lyrics }]);
    setSearchQuery(''); setLocalResults([]); setOnlineResults([]);
  };

  const handleSelectOnlineSong = async (song) => {
    setFetchingLyrics(true);
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`);
      const data = await res.json();
      if (data.lyrics) {
        setPreviewSong({ artist: song.artist, title: song.title, lyrics: data.lyrics.trim(), source: 'api' });
      } else {
        setManualTitle(song.title); setManualArtist(song.artist); setManualLyrics('');
        setShowManual(true); setOnlineResults([]);
      }
    } catch {
      setManualTitle(song.title); setManualArtist(song.artist); setManualLyrics('');
      setShowManual(true); setOnlineResults([]);
    }
    setFetchingLyrics(false);
  };

  const handleAddFromLibraryWithPreview = (song) => {
    setPreviewSong({ artist: song.artist, title: song.title, lyrics: song.lyrics, source: 'saved' });
  };

  const confirmAddSong = () => {
    if (!previewSong) return;
    setSongs(prev => [...prev, { artist: previewSong.artist, title: previewSong.title, lyrics: previewSong.lyrics }]);
    if (previewSong.source === 'api') saveSong({ ...previewSong });
    setPreviewSong(null);
    setSearchQuery(''); setLocalResults([]); setOnlineResults([]);
  };

  const handleAddManual = async () => {
    if (!manualTitle.trim() || !manualLyrics.trim()) return;
    const songData = { artist: manualArtist.trim() || 'Unknown', title: manualTitle.trim(), lyrics: manualLyrics };
    if (editingSavedSong) {
      // Update existing saved song in place
      await updateSavedSong(editingSavedSong.id, { title: songData.title, artist: songData.artist, lyrics: songData.lyrics });
      setEditingSavedSong(null);
    } else {
      setSongs(prev => [...prev, songData]);
      saveSong({ ...songData, source: 'vic' });
    }
    setManualTitle(''); setManualArtist(''); setManualLyrics(''); setShowManual(false);
    setSearchQuery(''); setLocalResults([]);
  };

  const removeSong = (index) => setSongs(prev => prev.filter((_, i) => i !== index));
  const moveSong = (index, dir) => {
    setSongs(prev => {
      const arr = [...prev]; const ni = index + dir;
      if (ni < 0 || ni >= arr.length) return arr;
      [arr[index], arr[ni]] = [arr[ni], arr[index]]; return arr;
    });
  };

  const handleSave = async () => {
    if (!date || songs.length === 0) return;
    if (editingSetlistId) {
      await updateSetlist(editingSetlistId, { date, songs });
      setEditingSetlistId(null);
    } else { await addSetlist({ date, songs }); }
    setDate(''); setSongs([]); navigate('/worship');
  };

  const handleEditSetlist = (sl) => {
    setEditingSetlistId(sl.id); setDate(sl.date); setSongs(sl.songs || []); setShowHistory(false);
  };

  const pastSetlists = setlists.filter(s => s.date < todayStr).sort((a, b) => b.date.localeCompare(a.date));
  const upcomingSetlists = setlists.filter(s => s.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));

  const inputClass = "w-full max-w-full box-border px-3 py-2 rounded-lg bg-warm-bg border border-warm-border text-xs placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-amber/30";

  return (
    <div className="min-h-svh px-5 py-5 overflow-x-hidden">
      <button onClick={() => navigate('/worship')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-2xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>Worship Leader Set Up</h1>

      {/* Upcoming setlists — at the top in green */}
      {upcomingSetlists.length > 0 && (
        <div className="bg-forest-dark rounded-xl p-3 mb-6">
          <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1.5">Upcoming Setlists</p>
          {upcomingSetlists.map(sl => (
            <div key={sl.id} className="flex items-center justify-between py-1">
              <span className="text-[11px] text-white/80">{formatDate(sl.date)} — {(sl.songs || []).length} songs</span>
              <div className="flex gap-2">
                <button onClick={() => handleEditSetlist(sl)} className="text-[10px] text-white/70 font-medium hover:text-white">Edit</button>
                <button onClick={() => deleteSetlist(sl.id)} className="text-[10px] text-white/40 hover:text-white/70">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Setlist header */}
      <div className="border-t border-warm-border pt-4 mb-4">
        <h2 className="font-title text-base font-semibold text-earth-dark mb-3">
          {editingSetlistId ? 'Edit Setlist' : 'Create New Setlist'}
        </h2>

        {/* Date picker */}
        <label className="text-xs text-earth font-medium block mb-1">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ width: '37.5vw', maxWidth: '150px', height: '30px', fontSize: '12px' }}
          className="px-3 rounded-lg bg-warm-bg border border-warm-border focus:outline-none focus:ring-2 focus:ring-amber/30" />
      </div>

      {/* Unified search */}
      <div className="mb-4">
        <label className="text-xs text-earth font-medium block mb-1">Find a song</label>
        <div className="flex gap-2">
          <input type="text" value={searchQuery} onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Type song title or artist..."
            className={`flex-1 ${inputClass}`} />
          <button onClick={handleSearch} disabled={searching || !searchQuery.trim()}
            className="px-4 py-2 rounded-lg bg-forest text-white text-xs font-medium shrink-0">
            {searching ? '...' : 'Search'}
          </button>
        </div>

        {/* Paste manually — right below search */}
        <div className="flex justify-end mt-1.5">
          <button onClick={() => { setShowManual(!showManual); setManualTitle(searchQuery); setManualArtist(''); setManualLyrics(''); setSearchQuery(''); setLocalResults([]); setOnlineResults([]); }}
            className="text-[11px] text-amber font-medium hover:text-amber-dark transition-colors">
            Paste lyrics manually
          </button>
        </div>

        {/* Search results — saved songs first, then online */}
        {(localResults.length > 0 || onlineResults.length > 0) && (
          <div className="mt-2 bg-warm-card rounded-xl border border-warm-border overflow-hidden max-h-[300px] overflow-y-auto">
            {/* Saved songs */}
            {localResults.length > 0 && (
              <>
                <div className="px-3 py-1 bg-forest/5 border-b border-warm-border">
                  <span className="text-[9px] text-forest font-medium uppercase tracking-widest">Saved songs</span>
                </div>
                {localResults.map(s => (
                  <div key={s.id} className="flex items-center px-3 py-2 border-b border-warm-border hover:bg-warm-bg transition-colors">
                    <button onClick={() => handleAddFromLibraryWithPreview(s)} className="flex-1 text-left">
                      <span className="text-[12px] text-earth font-medium">{s.title}</span>
                      <span className="text-[11px] text-earth-light/70 ml-2">{s.artist}</span>
                      {s.source === 'vic' && <span className="text-[8px] text-forest bg-forest/10 px-1.5 py-0.5 rounded-full font-medium ml-2">VIC</span>}
                    </button>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button onClick={() => { setEditingSavedSong(s); setManualTitle(s.title); setManualArtist(s.artist); setManualLyrics(s.lyrics); setShowManual(true); }}
                        className="text-earth-light/60 hover:text-earth text-[12px]">✎</button>
                      <button onClick={() => deleteSavedSong(s.id)}
                        className="text-dusty-pink/70 hover:text-dusty-pink text-[10px]">✕</button>
                    </div>
                  </div>
                ))}
              </>
            )}
            {/* Online results */}
            {onlineResults.length > 0 && (
              <>
                <div className="px-3 py-1 bg-amber/5 border-b border-warm-border">
                  <span className="text-[9px] text-amber font-medium uppercase tracking-widest">Online results</span>
                </div>
                {onlineResults.map((r, i) => (
                  <button key={i} onClick={() => handleSelectOnlineSong(r)} disabled={fetchingLyrics}
                    className="w-full text-left px-3 py-2 border-b border-warm-border last:border-0 hover:bg-warm-bg transition-colors">
                    <span className="text-[12px] text-earth font-medium">{r.title}</span>
                    <span className="text-[11px] text-earth-light/70 ml-2">{r.artist}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
        {fetchingLyrics && <p className="text-[11px] text-earth-light/70 mt-2 text-center italic">Fetching lyrics...</p>}
        {searching && <p className="text-[11px] text-earth-light/70 mt-2 text-center italic">Searching...</p>}
      </div>

      {/* Song preview popup */}
      {previewSong && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setPreviewSong(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-warm-card rounded-2xl shadow-xl border border-warm-border p-4 w-[320px] max-h-[75svh] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-earth-dark text-[14px]">{previewSong.title}</h3>
                <p className="text-[11px] text-earth-light/70">{previewSong.artist}</p>
              </div>
              <button onClick={() => setPreviewSong(null)} className="text-earth-light/60 text-sm">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto mb-3 border-t border-warm-border pt-2">
              <pre className="text-[11px] text-earth/80 leading-relaxed whitespace-pre-wrap font-body">{previewSong.lyrics}</pre>
            </div>
            <div className="flex gap-2">
              <button onClick={confirmAddSong}
                className="flex-1 py-2 rounded-full bg-forest text-white font-medium text-xs">Add to Setlist</button>
              <button onClick={() => setPreviewSong(null)}
                className="px-4 py-2 rounded-full bg-warm-bg border border-warm-border text-earth-light text-xs">Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Manual lyrics form */}
      {showManual && (
        <div className="bg-warm-card rounded-xl p-3 mb-4 border border-warm-border">
          <div className="flex flex-col gap-2">
            <input type="text" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)}
              placeholder="Song title" className={inputClass} />
            <input type="text" value={manualArtist} onChange={(e) => setManualArtist(e.target.value)}
              placeholder="Artist (optional)" className={inputClass} />
            <textarea value={manualLyrics}
              onChange={(e) => setManualLyrics(e.target.value)}
              onPaste={(e) => {
                e.preventDefault();
                const html = e.clipboardData.getData('text/html');
                const plain = e.clipboardData.getData('text/plain');
                let text;
                if (html && html.length > 0) {
                  // Create a temp div to parse HTML properly
                  const div = document.createElement('div');
                  div.innerHTML = html;
                  // Replace <br> with newlines
                  div.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
                  // Add double newlines after block elements
                  div.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6').forEach(el => {
                    el.prepend('\n');
                    el.append('\n');
                  });
                  text = div.textContent || div.innerText || '';
                  text = text.replace(/\n{3,}/g, '\n\n').trim();
                } else {
                  text = plain || '';
                }
                setManualLyrics(prev => {
                  const ta = e.target;
                  const start = ta.selectionStart;
                  const end = ta.selectionEnd;
                  return prev.slice(0, start) + text + prev.slice(end);
                });
              }}
              placeholder="Paste lyrics here..."
              rows={8} className={`${inputClass} resize-none font-mono text-[11px]`} />
            <div className="flex gap-2">
              <button onClick={handleAddManual}
                className="flex-1 py-1.5 rounded-full bg-forest text-white font-medium text-xs">{editingSavedSong ? 'Update Song' : 'Add Song'}</button>
              <button onClick={() => setShowManual(false)}
                className="px-4 py-1.5 rounded-full bg-warm-bg border border-warm-border text-earth-light text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Songs in setlist */}
      {songs.length > 0 && (
        <div className="mb-4">
          <label className="text-[11px] text-earth-light/60 uppercase tracking-wide block mb-1">Songs in setlist ({songs.length})</label>
          <div className="bg-warm-card rounded-xl border border-warm-border overflow-hidden">
            {songs.map((song, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-warm-border last:border-0">
                <span className="w-5 h-5 rounded-full bg-forest text-white text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveSong(i, -1)} disabled={i === 0}
                    className={`text-[10px] leading-none ${i === 0 ? 'text-earth-light/30' : 'text-earth-light/70 hover:text-earth'}`}>▲</button>
                  <button onClick={() => moveSong(i, 1)} disabled={i === songs.length - 1}
                    className={`text-[10px] leading-none ${i === songs.length - 1 ? 'text-earth-light/30' : 'text-earth-light/70 hover:text-earth'}`}>▼</button>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-earth font-medium">{song.title}</span>
                  <span className="text-[11px] text-earth/60 ml-1">{song.artist}</span>
                </div>
                <button onClick={() => removeSong(i)} className="text-dusty-pink/70 text-[11px] shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save */}
      {songs.length > 0 && (
        <div className="mb-4">
          {!date && <p className="text-[11px] text-amber text-center mb-1">Pick a date to save</p>}
          <button onClick={handleSave} disabled={!date}
            className={`w-full py-2.5 rounded-full font-medium text-xs tracking-wide transition-colors shadow-sm ${date ? 'bg-forest text-white hover:bg-forest-dark' : 'bg-earth-light/20 text-earth-light'}`}>
            {editingSetlistId ? 'Update Setlist' : 'Save Setlist'}
          </button>
        </div>
      )}

      {/* Past Setlists */}
      {/* Saved Songs */}
      <div className="mt-6 border-t border-warm-border pt-4">
        <button onClick={() => setShowSavedSongs(!showSavedSongs)}
          className="text-xs text-earth-light font-medium hover:text-earth transition-colors">
          {showSavedSongs ? '▾' : '▸'} Saved Songs ({savedSongs.length})
        </button>
        {showSavedSongs && (
          <div className="mt-2">
            {savedSongs.length === 0 ? (
              <p className="text-[11px] text-earth-light/70 italic">No saved songs yet.</p>
            ) : (
              <div className="bg-warm-card rounded-xl border border-warm-border overflow-hidden max-h-[300px] overflow-y-auto">
                {savedSongs.map(s => (
                  <div key={s.id} className="flex items-center px-3 py-2 border-b border-warm-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] text-earth font-medium">{s.title}</span>
                      <span className="text-[11px] text-earth/60 ml-2">{s.artist}</span>
                      {s.source === 'vic' && <span className="text-[8px] text-forest bg-forest/10 px-1.5 py-0.5 rounded-full font-medium ml-2">VIC</span>}
                    </div>
                    <div className="flex gap-2 shrink-0 ml-2">
                      <button onClick={() => { setEditingSavedSong(s); setManualTitle(s.title); setManualArtist(s.artist); setManualLyrics(s.lyrics); setShowManual(true); }}
                        className="text-earth/50 hover:text-earth text-[14px]">✎</button>
                      <button onClick={() => deleteSavedSong(s.id)}
                        className="text-dusty-pink/70 hover:text-dusty-pink text-[11px]">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Past Setlists */}
      <div className="mt-4">
        <button onClick={() => setShowHistory(!showHistory)}
          className="text-xs text-earth-light font-medium hover:text-earth transition-colors">
          {showHistory ? '▾' : '▸'} Past Setlists
        </button>
        {showHistory && (
          <div className="mt-2">
            {pastSetlists.length === 0 ? (
              <p className="text-[11px] text-earth-light/70 italic">No past setlists.</p>
            ) : (
              <div className="bg-warm-card rounded-xl border border-warm-border overflow-hidden">
                <table className="w-full text-[11px] table-fixed">
                  <thead>
                    <tr className="bg-earth-dark text-white/90">
                      <th className="text-left px-3 py-1.5 font-medium" style={{ width: '28%' }}>Date</th>
                      <th className="text-left px-3 py-1.5 font-medium" style={{ width: '55%' }}>Songs</th>
                      <th className="px-2 py-1.5" style={{ width: '17%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastSetlists.map(sl => (
                      <tr key={sl.id} className="border-b border-warm-border last:border-0 align-middle">
                        <td className="px-3 py-2 text-earth font-medium whitespace-nowrap align-middle">{formatDate(sl.date)}</td>
                        <td className="px-3 py-2 text-earth text-left align-middle">
                          {(sl.songs || []).map((s, i) => (
                            <div key={i} className="leading-snug">{s.artist} — {s.title}</div>
                          ))}
                        </td>
                        <td className="px-2 py-2 align-middle">
                          <div className="flex flex-col gap-1">
                            <button onClick={() => handleEditSetlist(sl)} className="text-[9px] text-forest font-medium">Edit</button>
                            <button onClick={() => deleteSetlist(sl.id)} className="text-[9px] text-dusty-pink/70">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
