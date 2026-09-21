import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://dhrsjibqttknavwekffx.supabase.co"
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocnNqaWJxdHRrbmF2d2VrZmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTgxODMsImV4cCI6MjEwNTU5NDE4M30.6B7NKoZpsl7mtMqTm32Q1MI8-js1C5AbMnjf11LkNO8"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
