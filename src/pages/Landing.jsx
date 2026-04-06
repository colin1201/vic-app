import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const BG_IMAGE = '/images/landing-bg.png';
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Landing() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('vic_unlocked') === 'true');
  const { PASSCODE, members, events, schedule, announcements, prayerRequests } = useApp();
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

  const activePosts = announcements?.filter(a => a.status !== 'completed').length || 0;
  const activePrayers = prayerRequests?.filter(p => p.status === 'active').length || 0;

  const navButtons = [
    { label: 'The Family', path: '/family' },
    { label: 'Posts', path: '/announcements', badge: activePosts },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Prayer', path: '/prayer', badge: activePrayers },
    { label: 'Worship', path: '/worship' },
  ];

  // Today's events
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const getMemberName = (id) => members.find(m => m.id === id)?.name || '—';

  const todayEvents = events.filter(e => todayStr >= e.start_date && todayStr <= e.end_date);
  const todayBirthdays = members.filter(m => m.birthday_day === today.getDate() && m.birthday_month === today.getMonth() + 1);
  const todaySchedule = today.getDay() === 6 ? schedule.find(s => s.date === todayStr) : null;

  const hasTodayContent = todaySchedule || todayEvents.length > 0 || todayBirthdays.length > 0;

  return (
    <div className="min-h-svh flex flex-col relative">
      {/* Full-viewport background — left and right match image edges */}
      <div className="fixed inset-0 z-0 flex">
        <div className="flex-1" style={{ backgroundColor: 'rgb(251,244,234)' }} />
        <div className="w-full max-w-[768px] lg:max-w-[960px]" />
        <div className="flex-1" style={{ backgroundColor: 'rgb(223,206,190)' }} />
      </div>
      {/* Background image — sits within the app container */}
      <img
        src={BG_IMAGE}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content over background */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* VIC logo */}
        <h1
          className="font-logo text-7xl text-forest-dark tracking-[0.08em] leading-none"
          style={{ fontWeight: 100 }}
        >
          VIC
        </h1>
        <div className="w-10 h-px bg-forest-dark/25 mt-3 mb-3" />

        {/* Verse */}
        <div className="max-w-[260px] mb-12">
          <p className="font-accent text-[14px] italic text-earth/80 text-center leading-relaxed">
            "For everyone who has been born of God overcomes the world. And this is the victory that has overcome the world—our faith."
          </p>
          <p className="text-xs text-earth-light/55 tracking-[0.2em] uppercase font-body mt-1 text-center">
            1 John 5:4
          </p>
        </div>

        {!unlocked ? (
          <form onSubmit={handleUnlock} className="flex flex-col items-center gap-2.5">
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-48 px-4 py-2 rounded-full bg-white/60 border border-warm-border text-center text-xs text-earth placeholder-earth-light/70 focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm"
            />
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button type="submit" className="px-8 py-2 rounded-full bg-forest-dark/80 backdrop-blur-sm text-white font-medium text-xs tracking-wide hover:bg-forest-dark transition-colors shadow-sm">
              Enter
            </button>
          </form>
        ) : (
          <>
            {/* Nav buttons */}
            <div className="flex flex-wrap justify-center gap-2.5 max-w-[320px] mb-6 mt-4 md:max-w-none">
              {navButtons.map((btn) => (
                <button
                  key={btn.path}
                  onClick={() => navigate(btn.path)}
                  className="relative px-5 py-2.5 rounded-full bg-forest-dark/80 text-white font-medium text-[13px] tracking-wide hover:bg-forest-dark transition-all shadow-sm"
                >
                  {btn.label}
                  {btn.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-white/80 border border-warm-border text-[8px] text-earth-light font-medium flex items-center justify-center shadow-sm">
                      {btn.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Events happening today */}
            <div className="text-center max-w-[280px] mx-auto mt-2">
              <p className="text-[11px] font-body font-semibold text-earth-light/80 uppercase tracking-[0.2em] mb-2">
                Events happening today
              </p>
              {hasTodayContent ? (
                <div className="font-accent text-[14px] italic text-earth/75 leading-snug">
                  {todaySchedule && (
                    <p>Cell today — {todaySchedule.study || 'Study TBD'}</p>
                  )}
                  {todayBirthdays.map(m => (
                    <p key={m.id}>🎂 {m.name}'s Birthday today</p>
                  ))}
                  {todayEvents.map(event => (
                    <p key={event.id}>{getMemberName(event.member_id)}: {event.activity}</p>
                  ))}
                </div>
              ) : (
                <p className="font-accent text-[14px] italic text-earth-light/80">
                  Nothing happening today.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
