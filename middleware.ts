import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export const config = {
	matcher: ['/', '/login', '/home'],
}

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()

	const supabase = createMiddlewareSupabaseClient<Database>({ req, res })

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		if (req.nextUrl.pathname === '/') return NextResponse.rewrite(new URL('/home', req.url))
	}

	if (req.nextUrl.pathname === '/login' && session) {
		return NextResponse.redirect(new URL('/', req.url))
	}

	return res
}
