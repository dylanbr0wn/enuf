import { useCallback, useEffect, useState } from 'react'
import { getTags, OS, os } from './utils'
import { Todos } from './zod'
import { Filter } from './zustand'
import useSwr from 'swr'
import { useSupabase } from '@/components/supabase-provider'
import { UserResponse } from '@supabase/supabase-js'

export function useOnKeyPress(
	targetKeys: KeyboardEvent['key'],
	callback: () => void,
	{ shift = false, ctrl = false, alt = false, meta = false } = {}
) {
	const downHandler = useCallback(
		(ev: KeyboardEvent) => {
			// ev.preventDefault()

			const { key } = ev

			if (key === targetKeys) {
				if (shift && !ev.shiftKey) return
				if (alt && !ev.altKey) return
				if (ctrl && !ev.ctrlKey) return
				if (meta && !ev.metaKey) return
				callback()
			}
		},
		[alt, callback, ctrl, shift, targetKeys, meta]
	)

	useEffect(() => {
		window.addEventListener('keydown', downHandler)

		return () => {
			window.removeEventListener('keydown', downHandler)
		}
	}, [downHandler])
}
function filterTodos(todos: Todos, filters: Filter[]) {
	const filtered = filters.reduce((acc, filter) => {
		if (filter.type === 'tag') {
			return acc.filter((item) => getTags(item.title).includes(filter.value))
		}
		if (filter.type === 'search') {
			return acc.filter((item) => item.title.includes(filter.value))
		}
		return acc
	}, todos)
	return filtered
}

export function useFilteredTodos(todos: Todos, filters: Filter[]) {
	const [filtered, setFiltered] = useState<Todos>(filterTodos(todos, filters))
	useEffect(() => {
		setFiltered(filterTodos(todos, filters))
	}, [todos, filters])
	return filtered
}

function parseUser(res: UserResponse | undefined) {
	if (!res) return null
	const user = res.data.user
	if (!user) return null

	const metadata = user.user_metadata

	const avatar = metadata?.avatar_url || metadata?.picture || null

	const username =
		metadata?.preferred_username ||
		metadata?.user_name ||
		metadata?.full_name ||
		metadata?.name ||
		user.email ||
		''

	return {
		...user,
		details: {
			avatar,
			username,
		},
	}
}

export function useUser() {
	const { supabase } = useSupabase()
	const { data, error } = useSwr('user', async () => await supabase.auth.getUser())

	return parseUser(data)
}
