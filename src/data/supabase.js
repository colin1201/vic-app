import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://bwzdtfykprgnperxjhxz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3emR0ZnlrcHJnbnBlcnhqaHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3Njc0NDUsImV4cCI6MjA5MDM0MzQ0NX0.G3Vd8AaBYLTFsJt_uBFYxBGSw4sa_B_SAf8VomqrW9I'
);
