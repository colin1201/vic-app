import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bwzdtfykprgnperxjhxz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3emR0ZnlrcHJnbnBlcnhqaHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Njc0NDUsImV4cCI6MjA5MDM0MzQ0NX0.G3Vd8AaBYLTFsJt_uBFYxBGSw4sa_B_SAf8VomqrW9I'
);

export default async function handler(req, res) {
  const { data, error } = await supabase.from('members').select('id', { count: 'exact', head: true });

  if (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, pinged: new Date().toISOString() });
}
