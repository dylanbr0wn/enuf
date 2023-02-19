'use client'

import { supabase } from '@/lib/supabase'
import { todoSchema, todosSchema } from '@/lib/zod'
import { useDragStore, useListStore } from '@/lib/zustand'
import { Reorder } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Item } from './item'
import type { Todos } from '@/lib/zod'

import { useFilteredTodos, useOnKeyPress } from '@/lib/hooks'
import { calcNewRank, OS, os } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

type ItemListProps = {
	listId: string
}

function ItemList({ listId }: ItemListProps) {
	const { update, setLoading, selected, setSelected, unfilteredTodos, filters } = useListStore(
		(s) => ({
			update: s.update,
			loading: s.loadingTodos,
			setLoading: s.setLoadingTodos,
			todos: s.items,
			selected: s.selected,
			setSelected: s.setSelected,
			unfilteredTodos: s.items,
			filters: s.filters,
		})
	)

	const filteredTodos = useFilteredTodos(unfilteredTodos, filters)

	const { setLastDragged, lastDragged } = useDragStore((s) => ({
		setLastDragged: s.setLastDragged,
		lastDragged: s.lastDragged,
	}))

	useOnKeyPress('ArrowUp', () => {
		setSelected((s) => {
			if (s === 0) {
				return filteredTodos.length - 1
			}
			return s - 1
		})
	})

	useOnKeyPress('ArrowDown', () => {
		setSelected((s) => {
			if (s === filteredTodos.length - 1) {
				return 0
			}
			return s + 1
		})
	})

	useOnKeyPress(
		'Enter',
		() => {
			if (filteredTodos.length > 0) {
				const id = filteredTodos.at(selected)?.id
				clickHandler(id ?? '')
			}
		},
		os() === OS.MacOS ? { meta: true } : { ctrl: true }
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

		if (selected >= filteredTodos.length - 1) {
			setSelected(filteredTodos.length - 2)
		}
		if (filteredTodos.length === 1) {
			setSelected(0)
		}
	}

	function onReorder(data: Todos) {
		update((todos) => {
			const newTodos: Todos = []
			let replaceMentIndex = 0

			todos.forEach((todo) => {
				if (data.some((item) => item.id === todo.id)) {
					newTodos.push(data[replaceMentIndex++])
				} else {
					newTodos.push(todo)
				}
			})
			return newTodos
		})
	}

	async function onDragEnd() {
		const rank = calcNewRank(unfilteredTodos, lastDragged ?? '')

		await supabase.from('todos').update({ sort_rank: rank }).eq('id', lastDragged)
	}

	const numFiltered = unfilteredTodos.length - filteredTodos.length

	return (
		<ScrollArea className="mx-auto w-full max-w-3xl ">
			<Reorder.Group
				axis="y"
				key={numFiltered}
				values={filteredTodos}
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
				{numFiltered > 0 ? (
					<div className="text-center text-sm text-gray-400 animate-in fade-in">
						{numFiltered} items hidden by filters
					</div>
				) : null}
			</Reorder.Group>
		</ScrollArea>
	)
}
export { ItemList }
