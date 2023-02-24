'use client'

import { useUser } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSupabase } from './supabase-provider'

export default function SupabaseListener({ serverAccessToken }: { serverAccessToken?: string }) {
	const { supabase } = useSupabase()
	const router = useRouter()

	const { mutate } = useUser()

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.access_token !== serverAccessToken) {
				mutate()
				router.refresh()
			}
			if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
				mutate()
				router.refresh()
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [serverAccessToken, router, supabase, mutate])

	return null
}
