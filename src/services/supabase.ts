import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njbqzqjweuzirctczktv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYnF6cWp3ZXV6aXJjdGN6a3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjQ2NTgsImV4cCI6MjA5MTUwMDY1OH0.QL-6NzombkhML5Ibx9Zje003-BtarVoslHPTEaVkmuM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);