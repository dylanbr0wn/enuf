'use client'

import { useRef, useState } from 'react'
import { Input } from './input'
import { z } from 'zod'
import { Loader2, Plus } from 'lucide-react'
import { createId } from '@paralleldrive/cuid2'
import { useListStore } from '@/lib/zustand'
import { todoSchema } from '@/lib/zod'
import { Button } from './button'
import { calcNewRank } from '@/lib/utils'
import { Separator } from './separator'
import { useSupabase } from './supabase-provider'

type InsertFormProps = {
	placeholder: string
	listId: string
}

export type FormValues = {
	newItem: string
}

const todoChangeSchema = z.string().max(100)
const todoSubmitSchema = todoChangeSchema.max(100)

function InsertForm({ placeholder, listId }: InsertFormProps) {
	const { supabase } = useSupabase()
	const { setLoading, loading, update, todos } = useListStore((s) => ({
		update: s.update,
		loading: s.loadingTodos,
		setLoading: s.setLoadingTodos,
		todos: s.items,
	}))

	const [input, setInput] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	function reset() {
		setInput('')
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const res = todoChangeSchema.safeParse(e.target.value)
		if (!res.success) return
		setInput(res.data)
	}

	function handleSubmit(fn: (data: FormValues) => void) {
		return (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()

			const res = todoSubmitSchema.safeParse(input)

			if (!res.success) {
				return
			}

			fn({ newItem: res.data })
		}
	}

	async function onSubmit(data: FormValues) {
		setLoading(true)

		const newTodo = todoSchema.parse({
			title: data.newItem,
			list_id: listId,
			id: createId(),
			description: '',
			created_at: new Date().toISOString(),
			priority: 2,
			sort_rank: '',
		})

		const newRank = calcNewRank([...todos, newTodo], newTodo.id)

		newTodo.sort_rank = newRank

		update((old) => [...old, newTodo])
		reset()
		inputRef.current?.focus()
		await supabase.from('todos').insert(newTodo)
		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="relative flex items-center gap-1 px-4">
			<Button variant="ghost" size="sm">
				<Plus className="h-4 w-4" />
			</Button>
			<div className="w-full">
				<Input
					name="newItem"
					ref={inputRef}
					value={input}
					onChange={handleChange}
					placeholder={placeholder}
				/>
				<Separator
					orientation="horizontal"
					className="w-full origin-left translate-y-[-1px] scale-x-0 bg-neutral-700 transition-transform peer-focus:scale-x-100 dark:bg-neutral-300"
				/>
			</div>

			{loading && (
				<div className="absolute top-1/2 right-2 -translate-y-1/2 ">
					<Loader2 className=" h-4 w-4 animate-spin text-neutral-700 animate-in animate-out fade-in fade-out" />
				</div>
			)}
		</form>
	)
}
export { InsertForm }
