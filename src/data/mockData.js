// Mock data for prototype — will be replaced with Supabase later

export const mockMembers = [
  { id: '1', name: 'Colin', gender: 'Guy', birthday_day: 12, birthday_month: 1 },
  { id: '2', name: 'Sarah', gender: 'Girl', birthday_day: 24, birthday_month: 3 },
  { id: '3', name: 'James', gender: 'Guy', birthday_day: 8, birthday_month: 7 },
  { id: '4', name: 'Rachel', gender: 'Girl', birthday_day: 15, birthday_month: 11 },
  { id: '5', name: 'David', gender: 'Guy', birthday_day: 3, birthday_month: 5 },
  { id: '6', name: 'Grace', gender: 'Girl', birthday_day: 20, birthday_month: 9 },
];

export const mockEvents = [
  { id: '1', member_id: '1', activity: 'Holiday', start_date: '2026-04-05', end_date: '2026-04-12', availability: 'Unavailable' },
  { id: '2', member_id: '2', activity: 'Available for games', start_date: '2026-04-05', end_date: '2026-04-05', availability: 'Available' },
  { id: '3', member_id: '3', activity: 'Work trip', start_date: '2026-03-28', end_date: '2026-04-02', availability: 'Unavailable' },
];

export const mockSchedule = [
  { id: '1', date: '2026-03-28', study: 'Romans 8', food_person_id: '1', games_person_id: '4', worship_person_id: '3', word_person_id: '2' },
  { id: '2', date: '2026-04-04', study: 'Romans 9', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
  { id: '3', date: '2026-04-11', study: '', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
];

export const mockPrayerRequests = [
  { id: '1', member_id: '1', visibility: 'Group', content: 'Pray for my job interview next week', status: 'active', created_at: '2026-03-20' },
  { id: '2', member_id: '2', visibility: 'Girl', content: 'Going through a tough season, need strength', status: 'active', created_at: '2026-03-22' },
  { id: '3', member_id: '3', visibility: 'Guy', content: 'Pray for my relationship with my dad', status: 'active', created_at: '2026-03-18' },
  { id: '4', member_id: '4', visibility: 'Group', content: 'Thankful for answered prayer — got the scholarship!', status: 'answered', created_at: '2026-03-15' },
];

export const PASSCODE = 'vic2024';
