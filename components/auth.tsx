'use client'

import { supabase } from '@/lib/supabase'
import { Auth as AuthUI, ThemeSupa } from '@supabase/auth-ui-react'
import { useTheme } from 'next-themes'
function Auth() {
	const { resolvedTheme } = useTheme()

	return (
		<AuthUI
			supabaseClient={supabase}
			appearance={{ theme: ThemeSupa }}
			theme={resolvedTheme}
			providers={['github', 'notion']}
		/>
	)
}

export default Auth
