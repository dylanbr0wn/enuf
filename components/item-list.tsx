'use client'

import { Todos } from '@/app/[slug]/page'
import { supabase } from '@/lib/supabase'
import { todoSchema } from '@/lib/zod'
import { useListStore } from '@/lib/zustand'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Card } from './card'
import { FormValues } from './insert-form'
import { Item } from './item'

type ItemListProps = {
	items: Todos
	listId: string
}

function ItemList({ items, listId }: ItemListProps) {
	const { update, loading, setLoading, todos } = useListStore((s) => ({
		update: s.update,
		loading: s.loadingTodos,
		setLoading: s.setLoadingTodos,
		todos: s.items,
	}))

	useEffect(() => {
		update((old) => items)
		return () => {
			update((old) => [])
		}
	}, [items, update])

	useEffect(() => {
		const channel = supabase
			.channel('value-db-changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'todos',
					filter: `list_id=eq.${listId}`,
				},
				(payload) => {
					const todo = todoSchema.parse(payload.new)

					update((old) => {
						if (old.some((item) => item.id === todo.id)) {
							return old
						}
						return [...old, todo]
					})
				}
			)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'todos',
					filter: `list_id=eq.${listId}`,
				},
				(payload) => {
					const todo = todoSchema.parse(payload.new)

					update((old) => {
						const index = old.findIndex((item) => item.id === todo.id)
						if (index === -1) {
							return old
						}
						old[index] = todo
						return old
					})
				}
			)
			.on(
				'postgres_changes',
				{
					event: 'DELETE',
					schema: 'public',
					table: 'todos',
					filter: `list_id=eq.${listId}`,
				},
				(payload) => {
					console.log('here')
					update((old) => old.filter((item) => item.id !== payload.old.id))
				}
			)
			.subscribe()

		return () => {
			channel.unsubscribe()
		}
	}, [listId, update])

	async function clickHandler(id: string) {
		setLoading(true)
		// update((old) => old.filter((item) => item.id !== id))
		await supabase.from('todos').delete().eq('id', id)
		setLoading(false)
	}

	return (
		<ul className="flex w-full flex-col-reverse gap-1">
			{todos.map((item) => (
				<li key={item.id}>
					<Item loading={loading} item={item} clickHandler={clickHandler} />
				</li>
			))}
		</ul>
	)
}
export { ItemList }
