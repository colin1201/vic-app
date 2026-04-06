import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { PASSCODE } from './mockData';

const AppContext = createContext();

const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function AppProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    async function load() {
      const [mRes, eRes, sRes, pRes, aRes, slRes, ssRes] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('events').select('*'),
        supabase.from('schedule').select('*').order('date'),
        supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('setlists').select('*').order('date', { ascending: false }),
        supabase.from('saved_songs').select('*').order('title'),
      ]);
      if (mRes.data) setMembers(mRes.data);
      if (eRes.data) setEvents(eRes.data);
      if (sRes.data) setSchedule(sRes.data);
      if (pRes.data) setPrayerRequests(pRes.data);
      if (aRes.data) setAnnouncements(aRes.data);
      if (slRes.data) setSetlists(slRes.data);
      if (ssRes.data) setSavedSongs(ssRes.data);
      setLoading(false);
    }
    load();
  }, []);

  // Members
  const addMember = async (member) => {
    const newMember = { ...member, id: String(Date.now()) };
    setMembers(prev => [...prev, newMember]);
    await supabase.from('members').insert(newMember);
  };

  const updateMember = async (id, updates) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    await supabase.from('members').update(updates).eq('id', id);
  };

  const deleteMember = async (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setEvents(prev => prev.filter(e => e.member_id !== id));
    setPrayerRequests(prev => prev.filter(p => p.member_id !== id));
    await supabase.from('events').delete().eq('member_id', id);
    await supabase.from('prayer_requests').delete().eq('member_id', id);
    await supabase.from('members').delete().eq('id', id);
  };

  // Events
  const addEvent = async (event) => {
    const { alsoAppliesTo, ...eventData } = event;
    const newEvents = [{ ...eventData, id: String(Date.now()) }];
    if (alsoAppliesTo && alsoAppliesTo.length > 0) {
      alsoAppliesTo.forEach((memberId, i) => {
        newEvents.push({ ...eventData, member_id: memberId, id: String(Date.now() + i + 1) });
      });
    }
    setEvents(prev => [...prev, ...newEvents]);
    await supabase.from('events').insert(newEvents);
  };

  const deleteEvent = async (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    await supabase.from('events').delete().eq('id', id);
  };

  // Schedule
  const updateScheduleEntry = async (id, updates) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    await supabase.from('schedule').update(updates).eq('id', id);
  };

  const deleteScheduleEntry = async (id) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, hidden: true } : s));
    await supabase.from('schedule').update({ hidden: true }).eq('id', id);
  };

  const addScheduleEntry = async (date) => {
    const entry = {
      id: String(Date.now()),
      date,
      study: '',
      food_person_id: null,
      games_person_id: null,
      worship_person_id: null,
      word_person_id: null,
    };
    setSchedule(prev => [...prev, entry].sort((a, b) => a.date.localeCompare(b.date)));
    await supabase.from('schedule').insert(entry);
  };

  const cancelScheduleEntry = async (id) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, cancelled: true } : s));
    await supabase.from('schedule').update({ cancelled: true }).eq('id', id);
  };

  const cancelAndShiftStudy = async (id) => {
    setSchedule(prev => {
      const sorted = [...prev].sort((a, b) => a.date.localeCompare(b.date));
      const idx = sorted.findIndex(s => s.id === id);
      if (idx === -1) return prev;

      const studies = sorted.slice(idx).map(s => s.study);
      const updated = sorted.map((s, i) => {
        if (i === idx) return { ...s, cancelled: true, study: '' };
        if (i > idx) {
          const shiftedStudy = studies[i - idx - 1] || '';
          return { ...s, study: shiftedStudy };
        }
        return s;
      });

      // Sync all changed entries to Supabase
      updated.slice(idx).forEach(entry => {
        supabase.from('schedule').update({ study: entry.study, cancelled: entry.cancelled || false }).eq('id', entry.id);
      });

      return updated;
    });
  };

  const generateYearSaturdays = useCallback(async (year) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const current = new Date(start);

    const dayOfWeek = current.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    current.setDate(current.getDate() + daysUntilSaturday);

    const saturdays = [];
    while (current <= end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      saturdays.push(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 7);
    }

    // Get current schedule from Supabase (source of truth)
    const { data: dbEntries } = await supabase.from('schedule').select('*').like('date', `${year}%`);
    const existingDates = new Set((dbEntries || []).map(s => s.date));
    const existing = new Map((dbEntries || []).map(s => [s.date, s]));

    // Only create entries for dates that DON'T exist at all in Supabase
    const newEntries = [];
    const merged = saturdays.map((dateStr, i) => {
      if (existing.has(dateStr)) return existing.get(dateStr);
      const entry = {
        id: `gen_${year}_${dateStr}`,
        date: dateStr,
        study: '',
        food_person_id: null,
        games_person_id: null,
        worship_person_id: null,
        word_person_id: null,
        hidden: false,
      };
      newEntries.push(entry);
      return entry;
    });

    // Insert only truly new entries — use deterministic IDs to prevent duplicates
    if (newEntries.length > 0) {
      // Use upsert to avoid duplicate key errors
      await supabase.from('schedule').upsert(newEntries, { onConflict: 'id' });
    }

    setSchedule(prev => {
      const otherYears = prev.filter(s => !s.date.startsWith(String(year)));
      return [...otherYears, ...merged].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, []);

  // Prayer Requests
  const addPrayerRequest = async (request) => {
    const newReq = {
      ...request,
      id: String(Date.now()),
      status: 'active',
      comments: [],
      created_at: todayLocal(),
    };
    setPrayerRequests(prev => [newReq, ...prev]);
    await supabase.from('prayer_requests').insert(newReq);
  };

  const updatePrayerRequest = async (id, updates) => {
    setPrayerRequests(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    await supabase.from('prayer_requests').update(updates).eq('id', id);
  };

  const addPrayerComment = async (requestId, comment) => {
    const newComment = {
      id: String(Date.now()),
      member_id: comment.member_id,
      content: comment.content,
      created_at: todayLocal(),
    };
    setPrayerRequests(prev => prev.map(p => p.id === requestId ? {
      ...p,
      comments: [...(p.comments || []), newComment],
    } : p));
    // Update the comments JSONB column
    const req = prayerRequests.find(p => p.id === requestId);
    const updatedComments = [...(req?.comments || []), newComment];
    await supabase.from('prayer_requests').update({ comments: updatedComments }).eq('id', requestId);
  };

  const editPrayerComment = async (requestId, commentId, newContent) => {
    setPrayerRequests(prev => prev.map(p => {
      if (p.id !== requestId) return p;
      const updatedComments = (p.comments || []).map(c =>
        c.id === commentId ? { ...c, content: newContent } : c
      );
      supabase.from('prayer_requests').update({ comments: updatedComments }).eq('id', requestId);
      return { ...p, comments: updatedComments };
    }));
  };

  const deletePrayerRequest = async (id) => {
    setPrayerRequests(prev => prev.filter(p => p.id !== id));
    await supabase.from('prayer_requests').delete().eq('id', id);
  };

  // Announcements
  const addAnnouncement = async (announcement) => {
    const newAnn = { ...announcement, id: String(Date.now()), pinned: false, status: 'active', comments: [], created_at: todayLocal() };
    setAnnouncements(prev => [newAnn, ...prev]);
    await supabase.from('announcements').insert(newAnn);
  };

  const updateAnnouncement = async (id, updates) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    await supabase.from('announcements').update(updates).eq('id', id);
  };

  const addAnnouncementComment = async (annId, comment) => {
    const newComment = { id: String(Date.now()), member_id: comment.member_id, content: comment.content, created_at: todayLocal() };
    setAnnouncements(prev => prev.map(a => {
      if (a.id !== annId) return a;
      const updated = [...(a.comments || []), newComment];
      supabase.from('announcements').update({ comments: updated }).eq('id', annId);
      return { ...a, comments: updated };
    }));
  };

  const deleteAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    await supabase.from('announcements').delete().eq('id', id);
  };

  // Setlists
  const addSetlist = async (setlist) => {
    const newSl = { ...setlist, id: String(Date.now()), created_at: todayLocal() };
    setSetlists(prev => [newSl, ...prev]);
    await supabase.from('setlists').insert(newSl);
  };

  const updateSetlist = async (id, updates) => {
    setSetlists(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    await supabase.from('setlists').update(updates).eq('id', id);
  };

  const deleteSetlist = async (id) => {
    setSetlists(prev => prev.filter(s => s.id !== id));
    await supabase.from('setlists').delete().eq('id', id);
  };

  // Saved Songs (VIC library)
  const saveSong = async (song) => {
    const exists = savedSongs.find(s => s.title.toLowerCase() === song.title.toLowerCase() && s.artist.toLowerCase() === song.artist.toLowerCase());
    if (exists) return;
    const newSong = { id: String(Date.now()), title: song.title, artist: song.artist, lyrics: song.lyrics, source: song.source || 'vic' };
    setSavedSongs(prev => [...prev, newSong]);
    await supabase.from('saved_songs').insert(newSong);
  };

  const updateSavedSong = async (id, updates) => {
    setSavedSongs(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    await supabase.from('saved_songs').update(updates).eq('id', id);
  };

  const deleteSavedSong = async (id) => {
    setSavedSongs(prev => prev.filter(s => s.id !== id));
    await supabase.from('saved_songs').delete().eq('id', id);
  };

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-warm-bg">
        <p className="text-earth-light text-xs font-accent italic">Loading...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      members: [...members].sort((a, b) => a.name.localeCompare(b.name)), addMember, updateMember, deleteMember,
      events, addEvent, deleteEvent,
      schedule, updateScheduleEntry, deleteScheduleEntry, addScheduleEntry, cancelScheduleEntry, cancelAndShiftStudy, generateYearSaturdays,
      prayerRequests, addPrayerRequest, updatePrayerRequest, addPrayerComment, editPrayerComment, deletePrayerRequest,
      announcements, addAnnouncement, updateAnnouncement, addAnnouncementComment, deleteAnnouncement,
      setlists, addSetlist, updateSetlist, deleteSetlist,
      savedSongs, saveSong, updateSavedSong, deleteSavedSong,
      PASSCODE,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
