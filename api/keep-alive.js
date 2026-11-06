import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bwzdtfykprgnperxjhxz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3emR0ZnlrcHJnbnBlcnhqaHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Njc0NDUsImV4cCI6MjA5MDM0MzQ0NX0.G3Vd8AaBYLTFsJt_uBFYxBGSw4sa_B_SAf8VomqrW9I'
);

// Sentinel row in the existing `schedule` table.
// date '1900-01-01' is filtered out by all UI views (year/month filters skip it).
// Each ping UPSERTs this row → real database write activity for Supabase.
const SENTINEL_ID = '__keep_alive__';

export default async function handler(req, res) {
  const now = new Date().toISOString();

  // Real write — UPSERT updates the row's study field with timestamp
  const { error: writeError } = await supabase
    .from('schedule')
    .upsert({
      id: SENTINEL_ID,
      date: '1900-01-01',
      study: `keep-alive ${now}`,
      hidden: true,
    }, { onConflict: 'id' });

  // Real read
  const { data, error: readError } = await supabase
    .from('schedule')
    .select('study')
    .eq('id', SENTINEL_ID)
    .single();

  if (writeError || readError) {
    return res.status(500).json({
      ok: false,
      writeError: writeError?.message,
      readError: readError?.message,
    });
  }

  return res.status(200).json({ ok: true, pinged: now, lastWrite: data?.study });
}
