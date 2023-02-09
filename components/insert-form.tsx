'use client'

import { useRef, useState } from 'react'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { createId } from '@paralleldrive/cuid2'
import { useListStore } from '@/lib/zustand'
import { todoSchema } from '@/lib/zod'

type InsertFormProps = {
	placeholder: string
	listId: string
}

export type FormValues = {
	newItem: string
}

function InsertForm({ placeholder, listId }: InsertFormProps) {
	const { setLoading, loading, update } = useListStore((s) => ({
		update: s.update,
		loading: s.loadingTodos,
		setLoading: s.setLoadingTodos,
	}))

	const { handleSubmit, register, reset } = useForm<FormValues>({
		defaultValues: {
			newItem: '',
		},
		resolver: zodResolver(
			z.object({
				newItem: z.string().min(1).max(100),
			})
		),
	})

	async function onSubmit(data: FormValues) {
		setLoading(true)
		const newTodo = todoSchema.parse({
			title: data.newItem,
			list_id: listId,
			id: createId(),
			description: '',
			created_at: new Date().toISOString(),
		})
		update((old) => [...old, newTodo])
		reset()
		await supabase.from('todos').insert(newTodo)
		setLoading(false)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="relative">
			<Input {...register('newItem')} placeholder={placeholder} />
			{loading && (
				<div className="absolute top-1/2 right-2 -translate-y-1/2 ">
					<Loader2 className=" h-4 w-4 animate-spin text-neutral-700 animate-in animate-out fade-in fade-out" />
				</div>
			)}
		</form>
	)
}
export { InsertForm }
