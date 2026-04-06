import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Worship() {
  const navigate = useNavigate();
  const { setlists } = useApp();
  const [openSong, setOpenSong] = useState(null);
  const [selectedUpcoming, setSelectedUpcoming] = useState(0);
  const [showUpcomingPicker, setShowUpcomingPicker] = useState(false);

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // Find upcoming setlists (date >= today)
  const upcoming = setlists
    .filter(s => s.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  const current = upcoming.length > 0 ? upcoming[selectedUpcoming] || upcoming[0] : null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="min-h-svh px-5 py-5">
      <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-5 top-5">←</button>
      <h1 className="font-logo text-3xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>Worship</h1>

      {/* Setup button */}
      <div className="flex justify-end mb-4 px-1">
        <button onClick={() => navigate('/worship/setup')}
          className="px-4 py-1.5 rounded-full bg-forest text-white font-medium text-xs shadow-sm hover:bg-forest-dark transition-colors">
          Worship Leader Set Up
        </button>
      </div>

      {/* Upcoming sets picker */}
      {upcoming.length > 1 && (
        <div className="flex justify-end mb-3 px-1">
          <button onClick={() => setShowUpcomingPicker(!showUpcomingPicker)}
            className="flex items-center gap-1.5 text-[11px] text-earth-light font-medium hover:text-earth transition-colors">
            Upcoming sets
            <span className="w-5 h-5 rounded-full bg-amber text-white text-[9px] font-bold flex items-center justify-center">{upcoming.length}</span>
          </button>
        </div>
      )}

      {showUpcomingPicker && upcoming.length > 1 && (
        <div className="bg-warm-card rounded-xl border border-warm-border p-2 mb-3">
          {upcoming.map((sl, i) => (
            <button key={sl.id} onClick={() => { setSelectedUpcoming(i); setShowUpcomingPicker(false); setOpenSong(null); }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-colors ${selectedUpcoming === i ? 'bg-forest/10 text-forest font-medium' : 'text-earth hover:bg-warm-bg'}`}>
              {formatDate(sl.date)} — {(sl.songs || []).length} songs
            </button>
          ))}
        </div>
      )}

      {/* Current setlist */}
      {current ? (
        <div>
          <p className="text-base text-forest-dark text-center mb-4 font-bold">{formatDate(current.date)}</p>

          <div className="flex flex-col gap-2">
            {(current.songs || []).map((song, i) => (
              <div key={i} className="bg-warm-card rounded-2xl shadow-sm border border-warm-border overflow-hidden">
                {/* Song header — tap to expand */}
                <button
                  onClick={() => setOpenSong(openSong === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  <span className="w-6 h-6 rounded-full bg-forest text-white text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <span className="font-medium text-earth text-[13px]">{song.title}</span>
                    <span className="text-[11px] text-earth-light/70 ml-2">{song.artist}</span>
                  </div>
                  <span className="text-earth-light/60 text-xs shrink-0">{openSong === i ? '▾' : '▸'}</span>
                </button>

                {/* Lyrics — expanded */}
                {openSong === i && (
                  <div className="px-4 pb-4 border-t border-warm-border">
                    <pre className="text-[12px] text-earth/80 leading-relaxed whitespace-pre-wrap font-body mt-3">
                      {song.lyrics}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-earth-light/70 text-center mt-12 font-accent italic">No worship songs chosen yet.</p>
      )}

      <BottomNav />
    </div>
  );
}
