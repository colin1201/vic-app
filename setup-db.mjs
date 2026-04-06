const SUPABASE_URL = 'https://bwzdtfykprgnperxjhxz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3emR0ZnlrcHJnbnBlcnhqaHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc2NzQ0NSwiZXhwIjoyMDkwMzQzNDQ1fQ.N8rySDtXjOxU-B39kVyX2l0973TUYOkGEYJA5gW0zJ8';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

async function sql(query) {
  // Use the pg_net or query endpoint - but Supabase doesn't expose raw SQL via REST for anon
  // Instead, let's create tables by inserting via REST after creating them through the management API
}

// Alternative: use Supabase Management API to run SQL
async function runSQL(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return res;
}

// Let's use the createClient approach instead
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function setup() {
  console.log('Setting up Supabase...');

  // Try to create tables using Supabase's SQL editor endpoint
  const sqlEndpoint = `${SUPABASE_URL}/pg/query`;

  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      birthday_day INTEGER,
      birthday_month INTEGER,
      birthday_year INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      member_id TEXT NOT NULL,
      activity TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      availability TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      study TEXT DEFAULT '',
      food_person_id TEXT,
      games_person_id TEXT,
      worship_person_id TEXT,
      word_person_id TEXT,
      cancelled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS prayer_requests (
      id TEXT PRIMARY KEY,
      member_id TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'Group',
      category TEXT DEFAULT '',
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      comments JSONB DEFAULT '[]'::jsonb,
      created_at TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- RLS policies
    ALTER TABLE members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
    ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
    ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on members') THEN
        CREATE POLICY "Allow all on members" ON members FOR ALL USING (true) WITH CHECK (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on events') THEN
        CREATE POLICY "Allow all on events" ON events FOR ALL USING (true) WITH CHECK (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on schedule') THEN
        CREATE POLICY "Allow all on schedule" ON schedule FOR ALL USING (true) WITH CHECK (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all on prayer_requests') THEN
        CREATE POLICY "Allow all on prayer_requests" ON prayer_requests FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;
  `;

  // Try the SQL query endpoint
  const res = await fetch(sqlEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: createTablesSQL }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.log('SQL endpoint response:', res.status, text);
    console.log('\nTrying alternative approach...');

    // If SQL endpoint doesn't work, output the SQL for manual execution
    console.log('\n=== Please run this SQL in your Supabase Dashboard SQL Editor ===');
    console.log('Go to: https://supabase.com/dashboard/project/bwzdtfykprgnperxjhxz/sql/new');
    console.log('\n' + createTablesSQL);
    return;
  }

  console.log('Tables created!');
  await seedData();
}

async function seedData() {
  console.log('Seeding members...');
  const members = [
    { id: '1', name: 'Samuel', gender: 'Guy', birthday_day: 22, birthday_month: 12, birthday_year: 1984 },
    { id: '2', name: 'David', gender: 'Guy', birthday_day: 22, birthday_month: 3, birthday_year: 1994 },
    { id: '3', name: 'Wei Hong', gender: 'Guy', birthday_day: 26, birthday_month: 6, birthday_year: 1986 },
    { id: '4', name: 'Seath', gender: 'Guy', birthday_day: 4, birthday_month: 10, birthday_year: null },
    { id: '5', name: 'Chris Teng', gender: 'Guy', birthday_day: 25, birthday_month: 9, birthday_year: 1989 },
    { id: '6', name: 'Errol', gender: 'Guy', birthday_day: 1, birthday_month: 1, birthday_year: 1989 },
    { id: '7', name: 'Chris Tan', gender: 'Guy', birthday_day: 8, birthday_month: 9, birthday_year: 1965 },
    { id: '8', name: 'Jeremy', gender: 'Guy', birthday_day: 10, birthday_month: 12, birthday_year: 1990 },
    { id: '9', name: 'Shawn', gender: 'Guy', birthday_day: null, birthday_month: null, birthday_year: null },
    { id: '10', name: 'Elliot', gender: 'Guy', birthday_day: 4, birthday_month: 8, birthday_year: 1989 },
    { id: '11', name: 'Esther', gender: 'Girl', birthday_day: null, birthday_month: null, birthday_year: null },
    { id: '12', name: 'Amelia', gender: 'Girl', birthday_day: 6, birthday_month: 10, birthday_year: 1994 },
    { id: '13', name: 'DK', gender: 'Girl', birthday_day: 10, birthday_month: 8, birthday_year: 1988 },
    { id: '14', name: 'Karen', gender: 'Girl', birthday_day: 24, birthday_month: 11, birthday_year: 1980 },
    { id: '15', name: 'Crystal', gender: 'Girl', birthday_day: 13, birthday_month: 10, birthday_year: 1987 },
    { id: '16', name: 'Serene', gender: 'Girl', birthday_day: 16, birthday_month: 5, birthday_year: 1993 },
    { id: '17', name: 'Qi Zhen', gender: 'Girl', birthday_day: 18, birthday_month: 10, birthday_year: 1990 },
    { id: '18', name: 'Alicia', gender: 'Girl', birthday_day: 22, birthday_month: 3, birthday_year: 1990 },
    { id: '19', name: 'Jo', gender: 'Girl', birthday_day: 8, birthday_month: 12, birthday_year: 1990 },
    { id: '20', name: 'Pauline', gender: 'Girl', birthday_day: 16, birthday_month: 7, birthday_year: 1994 },
    { id: '21', name: 'Jess', gender: 'Girl', birthday_day: 13, birthday_month: 10, birthday_year: 1992 },
  ];

  const { error: mErr } = await supabase.from('members').upsert(members);
  if (mErr) console.error('Members error:', mErr.message);
  else console.log('Members seeded!');

  console.log('Seeding schedule...');
  const schedule = [
    { id: 's1', date: '2026-01-10', study: '1. Overview', food_person_id: '14', games_person_id: null, worship_person_id: null, word_person_id: '1' },
    { id: 's2', date: '2026-01-24', study: '2. John to Jesus', food_person_id: '6', games_person_id: null, worship_person_id: null, word_person_id: '1' },
    { id: 's3', date: '2026-01-31', study: '-CELL SOCIAL-', food_person_id: null, games_person_id: '19', worship_person_id: '19', word_person_id: null },
    { id: 's4', date: '2026-02-07', study: '3. The Preparation', food_person_id: '17', games_person_id: null, worship_person_id: '16', word_person_id: '1' },
    { id: 's5', date: '2026-02-21', study: '4. Galilean Ministry Begins', food_person_id: '14', games_person_id: null, worship_person_id: '20', word_person_id: '1' },
    { id: 's6', date: '2026-03-07', study: '5. Kingdom People', food_person_id: '17', games_person_id: '8', worship_person_id: '16', word_person_id: '1' },
    { id: 's7', date: '2026-03-21', study: '6. From Town to Town', food_person_id: '13', games_person_id: null, worship_person_id: '1', word_person_id: '1' },
    { id: 's8', date: '2026-04-04', study: '7. With Great Authority', food_person_id: '16', games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's9', date: '2026-04-18', study: '8. On the Alert', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's10', date: '2026-05-02', study: '9. Parables and Teachings', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's11', date: '2026-05-16', study: '10. The Way to Life', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's12', date: '2026-05-30', study: '-CELL SOCIAL-', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's13', date: '2026-06-06', study: '11. The Son of David', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's14', date: '2026-06-20', study: '12. Questions', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: '1' },
    { id: 's15', date: '2026-07-04', study: '13. The End Approaches', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's16', date: '2026-07-18', study: '14. Arrest, Trial and Death', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's17', date: '2026-08-01', study: '15. Resurrection and Ascension', food_person_id: '6', games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's18', date: '2026-08-15', study: '16. Looking Back', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's19', date: '2026-08-29', study: '-CELL SOCIAL-', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's20', date: '2026-10-31', study: '-CELL SOCIAL-', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's21', date: '2026-12-05', study: '-CELL CHRISTMAS-', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
    { id: 's22', date: '2026-12-19', study: '-BREAK-', food_person_id: null, games_person_id: null, worship_person_id: null, word_person_id: null },
  ];

  const { error: sErr } = await supabase.from('schedule').upsert(schedule);
  if (sErr) console.error('Schedule error:', sErr.message);
  else console.log('Schedule seeded!');

  console.log('Done!');
}

setup().catch(console.error);
