'use client'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'

function SupaAuth() {
	return <Auth supabaseClient={supabase} providers={['notion']} />
}
export { SupaAuth }
