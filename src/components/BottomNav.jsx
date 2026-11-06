import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../data/store';
import FontSizeEditor from './FontSizeEditor';

const links = [
  { label: 'Family', path: '/family' },
  { label: 'Posts', path: '/announcements', badgeKey: 'posts' },
  { label: 'Schedule', path: '/schedule' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Prayer', path: '/prayer', badgeKey: 'prayer' },
  { label: 'Worship', path: '/worship' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { prayerRequests, announcements } = useApp();

  const badges = {
    posts: announcements.filter(a => a.status !== 'completed').length,
    prayer: prayerRequests.filter(p => p.status === 'active').length,
  };

  // Match nav bar to private prayer page theme
  const isPrivate = pathname === '/prayer/private';
  const privateType = isPrivate ? sessionStorage.getItem('vic_private_type') : null;

  let navBg = 'bg-warm-bg/90';
  let navBorder = 'border-warm-border';
  if (privateType === 'Guys') { navBg = 'bg-slate-100/95'; navBorder = 'border-slate-200'; }
  else if (privateType === 'Girls') { navBg = 'bg-rose-50/95'; navBorder = 'border-rose-100'; }

  return (
    <>
      <div className="h-14" />

      <div className="fixed bottom-14 right-3 z-30">
        <FontSizeEditor />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className={`mx-auto px-2 py-2 ${navBg} backdrop-blur-sm border-t ${navBorder}`} style={{ maxWidth: '768px' }}>
          <div className="flex justify-around">
            {links.map(link => {
              const count = link.badgeKey ? badges[link.badgeKey] : 0;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-[13px] transition-colors relative ${
                    pathname === link.path || (link.path === '/prayer' && pathname.startsWith('/prayer'))
                      ? 'text-forest font-medium'
                      : 'text-earth-light/80 hover:text-earth-light'
                  }`}
                >
                  {link.label}
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 w-3.5 h-3.5 rounded-full bg-warm-card border border-warm-border text-[7px] text-earth-light font-medium flex items-center justify-center shadow-sm">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
