import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';
import BottomNav from '../components/BottomNav';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const navigate = useNavigate();
  const { members, events, schedule } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '—';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build cell data for each day
  const buildDayData = (d) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSaturday = new Date(year, month, d).getDay() === 6;

    // Schedule entry for this day
    const scheduleEntry = isSaturday ? schedule.find(s => s.date === dateStr) : null;
    const hasCell = !!scheduleEntry && !!scheduleEntry.study;

    // Events active on this day
    const dayEvents = [];
    events.forEach((event) => {
      if (dateStr >= event.start_date && dateStr <= event.end_date) {
        dayEvents.push(event);
      }
    });

    // Birthdays
    const birthdays = members.filter(m => m.birthday_day === d && m.birthday_month === month + 1);

    const unavailableCount = hasCell ? dayEvents.filter(e => e.availability?.toLowerCase() === 'unavailable').length : 0;
    const totalEvents = dayEvents.length;

    return { dateStr, hasCell, scheduleEntry, dayEvents, birthdays, unavailableCount, totalEvents };
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, ...buildDayData(d) });
  }

  // Selected day data for popup
  const selectedCell = selectedDate ? cells.find(c => c.day === selectedDate) : null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
  };

  return (
    <div className="min-h-svh px-4 py-5 pb-20">
      <button onClick={() => navigate('/')} className="text-earth-light text-sm absolute left-4 top-5">←</button>
      <h1 className="font-logo text-3xl text-earth-dark text-center mb-4" style={{ fontWeight: 100 }}>Calendar</h1>

      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-earth-light text-xs px-2 py-1 hover:bg-warm-card rounded-lg transition-colors">←</button>
        <h2 className="font-title text-base text-earth-dark font-semibold">{MONTH_NAMES[month]} {year}</h2>
        <button onClick={nextMonth} className="text-earth-light text-xs px-2 py-1 hover:bg-warm-card rounded-lg transition-colors">→</button>
      </div>

      <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-2 overflow-hidden">
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-[10px] font-semibold text-earth-light/70 py-0.5">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => (
            <div
              key={i}
              onClick={() => cell.day && setSelectedDate(cell.day === selectedDate ? null : cell.day)}
              className={`min-h-[76px] md:min-h-[100px] rounded-lg p-1 cursor-pointer transition-all ${
                cell.day
                  ? cell.day === selectedDate
                    ? 'bg-forest/10 ring-1 ring-forest/30'
                    : 'bg-warm-bg/60 hover:bg-warm-bg'
                  : ''
              }`}
            >
              {cell.day && (
                <>
                  {/* Day number */}
                  <div className={`text-[10px] font-medium mb-0.5 px-0.5 ${
                    cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? 'text-white bg-amber rounded-full w-4 h-4 flex items-center justify-center'
                      : 'text-earth/60'
                  }`}>
                    {cell.day}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    {/* CELL badge — always first */}
                    {cell.hasCell && (
                      <div className="text-[8px] leading-tight px-1 py-0.5 rounded bg-forest-dark text-white font-bold truncate">
                        CELL
                      </div>
                    )}

                    {/* Birthdays — not clickable, shown as cake + name */}
                    {cell.birthdays.map(m => (
                      <div key={m.id} className="text-[8px] leading-tight px-1 py-0.5 text-earth-light/70 truncate">
                        🎂 {m.name}
                      </div>
                    ))}

                    {/* Event count */}
                    {cell.totalEvents > 0 && (
                      <div className="text-[8px] leading-tight px-1 py-0.5 rounded bg-amber/15 text-amber-dark font-semibold border border-amber/25 truncate">
                        {cell.totalEvents} event{cell.totalEvents !== 1 ? 's' : ''}
                      </div>
                    )}

                    {/* Unavailable count */}
                    {cell.unavailableCount > 0 && (
                      <div className="text-[8px] leading-tight px-1 py-0.5 text-earth-light/70 truncate">
                        {cell.unavailableCount} unavailable
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events happening this month */}
      {(() => {
        const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthEvents = events.filter(e => {
          return e.start_date.startsWith(monthStr) || e.end_date.startsWith(monthStr) ||
            (e.start_date < monthStr + '-01' && e.end_date >= monthStr + '-01');
        });
        if (monthEvents.length === 0) return null;
        return (
          <div className="mt-3 px-1">
            <h3 className="text-[10px] font-semibold text-earth-light uppercase tracking-widest mb-1.5">Events this month</h3>
            <div className="space-y-0.5">
              {monthEvents.map(e => (
                <p key={e.id} className="text-[11px] text-earth/70">
                  <span className="font-medium text-earth">{getMemberName(e.member_id)}</span>: {e.activity} · {formatDate(e.start_date)}–{formatDate(e.end_date)} · <span className={e.availability?.toLowerCase() === 'available' ? 'text-forest' : 'text-amber'}>{e.availability}</span>
                </p>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bottom popup */}
      {selectedCell && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5">
          <div className="bg-forest-dark rounded-2xl shadow-xl max-h-[55svh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-forest-dark rounded-t-2xl px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/10">
              <h3 className="text-xs font-semibold text-white">
                {selectedDate} {MONTH_NAMES[month]} {year}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="text-white/50 hover:text-white text-[11px] px-1">✕</button>
            </div>

            <div className="px-4 py-3 space-y-3">
              {/* CELL section */}
              {selectedCell.hasCell && (
                <div>
                  <div className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1.5">Cell</div>
                  <div className="text-[11px] text-white/80 space-y-0.5">
                    {selectedCell.scheduleEntry.study && (
                      <p>Study: <span className="text-white font-medium">{selectedCell.scheduleEntry.study}</span></p>
                    )}
                    <p>Food: <span className="text-white font-medium">{selectedCell.scheduleEntry.food_person_id ? getMemberName(selectedCell.scheduleEntry.food_person_id) : '—'}</span></p>
                    <p>Games: <span className="text-white font-medium">{selectedCell.scheduleEntry.games_person_id ? getMemberName(selectedCell.scheduleEntry.games_person_id) : '—'}</span></p>
                    <p>Worship: <span className="text-white font-medium">{selectedCell.scheduleEntry.worship_person_id ? getMemberName(selectedCell.scheduleEntry.worship_person_id) : '—'}</span></p>
                    <p>Word: <span className="text-white font-medium">{selectedCell.scheduleEntry.word_person_id ? getMemberName(selectedCell.scheduleEntry.word_person_id) : '—'}</span></p>
                  </div>
                </div>
              )}

              {/* Birthdays */}
              {selectedCell.birthdays.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1">Birthdays</div>
                  {selectedCell.birthdays.map(m => (
                    <p key={m.id} className="text-[11px] text-white/80">
                      🎂 <span className="text-white font-medium">{m.name}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Events */}
              {selectedCell.dayEvents.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1.5">
                    {selectedCell.dayEvents.length} event{selectedCell.dayEvents.length !== 1 ? 's' : ''}
                  </div>
                  <div className="space-y-1">
                    {selectedCell.dayEvents.map((event) => (
                      <div key={event.id} className="text-[11px] text-white/80">
                        <span className="text-white font-medium">{getMemberName(event.member_id)}</span>
                        <span className="text-white/60">: </span>
                        I am/have {event.activity} from {formatDate(event.start_date)} to {formatDate(event.end_date)} and I am{' '}
                        <span className={event.availability?.toLowerCase() === 'available' ? 'text-green-300' : 'text-red-300'}>{event.availability}</span>
                        {' '}for Cell
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unavailable count */}
              {selectedCell.unavailableCount > 0 && (
                <div className="border-t border-white/10 pt-2">
                  <p className="text-[11px] text-red-300/80 font-medium">
                    {selectedCell.unavailableCount} unavailable for Cell
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!selectedCell.hasCell && selectedCell.dayEvents.length === 0 && selectedCell.birthdays.length === 0 && (
                <p className="text-[11px] text-white/40">Nothing on this day.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedDate(null)} />
      )}
      <BottomNav />
    </div>
  );
}
