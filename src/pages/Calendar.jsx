import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../data/store';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const navigate = useNavigate();
  const { members, events, schedule } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const getMemberName = (id) => members.find(m => m.id === id)?.name || '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push({ day: null, events: [] });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = [];

    events.forEach((event) => {
      if (dateStr >= event.start_date && dateStr <= event.end_date) {
        dayEvents.push({ type: event.availability === 'Available' ? 'available' : 'unavailable', label: `${getMemberName(event.member_id)}: ${event.activity}` });
      }
    });

    members.forEach((member) => {
      if (member.birthday_day === d && member.birthday_month === month + 1) {
        dayEvents.push({ type: 'birthday', label: `${member.name}: Birthday!` });
      }
    });

    if (new Date(year, month, d).getDay() === 6) {
      const entry = schedule.find(s => s.date === dateStr);
      if (entry?.study) dayEvents.push({ type: 'schedule', label: `CELL: ${entry.study}` });
    }

    cells.push({ day: d, events: dayEvents });
  }

  const colorMap = {
    available: 'bg-dusty-pink/20 text-dusty-pink font-semibold border border-dusty-pink/30',
    unavailable: 'bg-earth/10 text-earth font-semibold border border-earth/20',
    birthday: 'bg-pastel-blue/25 text-blue-700 font-semibold border border-pastel-blue/40',
    schedule: 'bg-forest/15 text-forest font-semibold border border-forest/25',
  };

  return (
    <div className="min-h-svh px-4 py-5">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/')} className="text-earth-light text-sm">←</button>
        <h1 className="font-title text-xl text-earth-dark font-semibold">Calendar</h1>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-earth-light text-xs px-2 py-1 hover:bg-warm-card rounded-lg transition-colors">←</button>
        <h2 className="font-title text-base text-earth-dark font-semibold">{MONTHS[month]} {year}</h2>
        <button onClick={nextMonth} className="text-earth-light text-xs px-2 py-1 hover:bg-warm-card rounded-lg transition-colors">→</button>
      </div>

      <div className="bg-warm-card rounded-2xl shadow-sm border border-warm-border p-2 overflow-hidden">
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-[9px] font-semibold text-earth-light/50 py-0.5">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => (
            <div key={i} className={`min-h-[76px] rounded-lg p-1 ${cell.day ? 'bg-warm-bg/60' : ''}`}>
              {cell.day && (
                <>
                  <div className={`text-[9px] font-medium mb-0.5 px-0.5 ${
                    cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? 'text-white bg-dusty-pink rounded-full w-4 h-4 flex items-center justify-center'
                      : 'text-earth-light/60'
                  }`}>
                    {cell.day}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {cell.events.map((event, j) => (
                      <div key={j} className={`text-[8px] leading-tight px-1 py-0.5 rounded truncate ${colorMap[event.type]}`} title={event.label}>
                        {event.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
