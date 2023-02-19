'use client'

import { supabase } from '@/lib/supabase'
import { todoSchema, todosSchema } from '@/lib/zod'
import { filteredTodoSelector, useDragStore, useListStore } from '@/lib/zustand'
import { Reorder } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Item } from './item'
import type { Todos } from '@/lib/zod'

import { useOnKeyPress } from '@/lib/hooks'
import { calcNewRank } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

type ItemListProps = {
	listId: string
}

function ItemList({ listId }: ItemListProps) {
	const { update, setLoading, todos, selected, setSelected, filteredTodos } = useListStore((s) => ({
		update: s.update,
		loading: s.loadingTodos,
		setLoading: s.setLoadingTodos,
		todos: s.items,
		selected: s.selected,
		setSelected: s.setSelected,
		filteredTodos: filteredTodoSelector(s),
	}))

	const { setLastDragged, lastDragged } = useDragStore((s) => ({
		setLastDragged: s.setLastDragged,
		lastDragged: s.lastDragged,
	}))

	useOnKeyPress('ArrowUp', () => {
		setSelected((s) => {
			if (s === 0) {
				return todos.length - 1
			}
			return s - 1
		})
	})

	useOnKeyPress('ArrowDown', () => {
		setSelected((s) => {
			if (s === todos.length - 1) {
				return 0
			}
			return s + 1
		})
	})

	useOnKeyPress(
		'Enter',
		() => {
			if (todos.length > 0) {
				const id = todos.at(selected)?.id
				clickHandler(id ?? '')
			}
		},
		{ meta: true }
	)

	useEffect(() => {
		async function getTodos(listId: string) {
			const { data, error } = await supabase.from('lists').select('*, todos(*)').eq('id', listId)

			const todos = data?.at(0)?.todos

			if (!todos) {
				return todosSchema.parse([])
			}

			if (!Array.isArray(todos)) {
				return todosSchema.parse([todos])
			}
			todos.sort((a, b) => ('' + a.sort_rank).localeCompare(b.sort_rank ?? ''))
			update(() => todosSchema.parse(todos))
		}

		getTodos(listId)
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
					update((old) => old.map((item) => (item.id === todo.id ? todo : item)))
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
					update((old) => old.filter((item) => item.id !== payload.old.id))
				}
			)
			.subscribe()
		return () => {
			update((old) => [])
			channel.unsubscribe()
		}
	}, [listId, update])

	async function clickHandler(id: string) {
		setLoading(true)
		// update((old) => old.filter((item) => item.id !== id))
		await supabase.from('todos').delete().eq('id', id)
		setLoading(false)

		if (selected >= todos.length - 1) {
			setSelected(todos.length - 2)
		}
		if (todos.length === 1) {
			setSelected(0)
		}
	}

	async function onReorder(data: Todos) {
		update(() => data)
	}

	async function onDragEnd() {
		const rank = calcNewRank(todos, lastDragged ?? '')

		await supabase.from('todos').update({ sort_rank: rank }).eq('id', lastDragged)
	}

	return (
		<ScrollArea className="mx-auto w-full max-w-3xl ">
			<Reorder.Group
				axis="y"
				values={todos}
				onReorder={onReorder}
				className="flex w-full flex-col gap-1"
			>
				{filteredTodos.map((item, i) => (
					<Item
						index={i}
						onDragEnd={onDragEnd}
						key={item.id}
						item={item}
						clickHandler={clickHandler}
					/>
				))}
			</Reorder.Group>
		</ScrollArea>
	)
}
export { ItemList }
