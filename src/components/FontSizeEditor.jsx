import { useState, useEffect } from 'react';

const SIZES = { S: '12.5px', M: '14.5px', L: '17px' };

export default function FontSizeEditor() {
  const [size, setSize] = useState(() => localStorage.getItem('vic_fontSize') || 'M');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = SIZES[size];
    localStorage.setItem('vic_fontSize', size);
  }, [size]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-warm-card/80 backdrop-blur-sm border border-warm-border shadow-sm flex items-center justify-center text-[10px] text-earth-light/70 hover:text-earth transition-colors">
        Aa
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-1.5 bg-warm-card rounded-lg shadow-lg border border-warm-border p-1.5 flex gap-1 z-50">
            {Object.keys(SIZES).map(s => (
              <button key={s} onClick={() => { setSize(s); setOpen(false); }}
                className={`w-7 h-7 rounded-full text-[10px] font-medium transition-all ${
                  size === s ? 'bg-forest text-white' : 'bg-warm-bg text-earth-light hover:bg-warm-bg/80'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
