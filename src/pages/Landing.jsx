import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80';

export default function Landing() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('vic_unlocked') === 'true');
  const { PASSCODE } = useApp();
  const navigate = useNavigate();

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      sessionStorage.setItem('vic_unlocked', 'true');
      setUnlocked(true);
      setError('');
    } else {
      setError('Wrong passcode. Try again.');
    }
  };

  const navButtons = [
    { label: 'The Family', path: '/family' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Prayer', path: '/prayer' },
  ];

  return (
    <div className="min-h-svh flex flex-col">
      {/* Hero image with overlay */}
      <div className="relative w-full h-[55svh] overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Warm dreamy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-earth-dark/10 to-warm-bg" />
        <div className="absolute inset-0 bg-dusty-pink/8 mix-blend-soft-light" />

        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1
            className="font-logo text-7xl text-white font-bold tracking-[0.08em] leading-none"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.5), 0 0 100px rgba(255,255,255,0.15)' }}
          >
            VIC
          </h1>
          <div className="w-10 h-px bg-white/40 mt-3" />
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex-1 flex flex-col items-center px-6 pt-5 pb-8">
        {/* Verse */}
        <p className="font-accent text-[12px] italic text-earth-light text-center max-w-[240px] leading-relaxed mb-6">
          "And let us consider how we may spur one another on toward love and good deeds…"
          <br />
          <span className="not-italic text-[9px] text-earth-light/50 tracking-[0.2em] uppercase font-body">
            Hebrews 10:24-25
          </span>
        </p>

        {!unlocked ? (
          <form onSubmit={handleUnlock} className="flex flex-col items-center gap-2.5">
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-48 px-4 py-2 rounded-full bg-warm-card border border-warm-border text-center text-xs text-text placeholder-earth-light/50 focus:outline-none focus:ring-2 focus:ring-dusty-pink/40 shadow-sm"
            />
            {error && <p className="text-dusty-pink text-[10px]">{error}</p>}
            <button type="submit" className="px-8 py-2 rounded-full bg-forest text-white font-medium text-xs tracking-wide hover:bg-forest-dark transition-colors shadow-sm">
              Enter
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 w-fit">
            {navButtons.map((btn) => (
              <button
                key={btn.path}
                onClick={() => navigate(btn.path)}
                className="px-5 py-2.5 rounded-full bg-forest text-white font-medium text-[11px] tracking-wide hover:bg-forest-dark transition-all shadow-sm"
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
