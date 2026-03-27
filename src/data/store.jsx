import { createContext, useContext, useState } from 'react';
import { mockMembers, mockEvents, mockSchedule, mockPrayerRequests, PASSCODE } from './mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [members, setMembers] = useState(mockMembers);
  const [events, setEvents] = useState(mockEvents);
  const [schedule, setSchedule] = useState(mockSchedule);
  const [prayerRequests, setPrayerRequests] = useState(mockPrayerRequests);

  const addMember = (member) => {
    setMembers([...members, { ...member, id: String(Date.now()) }]);
  };

  const updateMember = (id, updates) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
    setEvents(events.filter(e => e.member_id !== id));
    setPrayerRequests(prayerRequests.filter(p => p.member_id !== id));
  };

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: String(Date.now()) }]);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const updateScheduleEntry = (id, updates) => {
    setSchedule(schedule.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const generateSaturdays = (startDate, endDate) => {
    const saturdays = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);

    // Move to first Saturday
    const dayOfWeek = current.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    current.setDate(current.getDate() + daysUntilSaturday);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      // Don't add if already exists
      if (!schedule.find(s => s.date === dateStr)) {
        saturdays.push({
          id: String(Date.now() + saturdays.length),
          date: dateStr,
          study: '',
          food_person_id: null,
          games_person_id: null,
          worship_person_id: null,
          word_person_id: null,
        });
      }
      current.setDate(current.getDate() + 7);
    }

    if (saturdays.length > 0) {
      setSchedule([...schedule, ...saturdays].sort((a, b) => a.date.localeCompare(b.date)));
    }
  };

  const addPrayerRequest = (request) => {
    setPrayerRequests([...prayerRequests, {
      ...request,
      id: String(Date.now()),
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
    }]);
  };

  const updatePrayerRequest = (id, updates) => {
    setPrayerRequests(prayerRequests.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePrayerRequest = (id) => {
    setPrayerRequests(prayerRequests.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      members, addMember, updateMember, deleteMember,
      events, addEvent, deleteEvent,
      schedule, updateScheduleEntry, generateSaturdays,
      prayerRequests, addPrayerRequest, updatePrayerRequest, deletePrayerRequest,
      PASSCODE,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
