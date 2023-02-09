import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { FormValues, InsertForm } from '@/components/insert-form'
import { ItemList } from '@/components/item-list'
import { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { todosSchema } from '@/lib/zod'
import { cookies, headers } from 'next/headers'

async function getTodos(listId: string) {
	const { data, error } = await supabase.from('lists').select('*, todos(*)').eq('id', listId)

	const todos = data?.at(0)?.todos

	if (!todos) {
		return todosSchema.parse([])
	}

	if (!Array.isArray(todos)) {
		return todosSchema.parse([todos])
	}

	return todosSchema.parse(todos)
}

const placeholder_todos = [
	'Buy coffee beans',
	'Pay utilities',
	'Take out the trash',
	'Finish the design',
	'Write the blog post',
	'Do math homework',
]

function getRandomPlaceholder() {
	return placeholder_todos[Math.floor(Math.random() * placeholder_todos.length)]
}

export type Todos = Awaited<ReturnType<typeof getTodos>>

export type Todo = Database['public']['Tables']['todos']['Row']

type ListProps = {
	params: {
		slug: string
	}
}

export default async function List({ params }: ListProps) {
	const todos = await getTodos(params.slug)

	return (
		<main className="">
			<div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-12 ">
				<div className="blue-glow absolute top-1/2 left-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-50" />
				<div className="pink-glow absolute top-2/3 left-2/3 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-30" />
				<h1 className="shrink-0 bg-gradient-to-t from-neutral-800 to-neutral-600 bg-clip-text py-10 text-6xl font-bold text-transparent animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
					The{' '}
					<span className="bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-500 bg-clip-text font-black text-transparent">
						perfect
					</span>{' '}
					task list
				</h1>
				<Card className="shrink-0 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-500">
					<InsertForm listId={params.slug} placeholder={getRandomPlaceholder()} />
				</Card>

				<ItemList items={todos} listId={params.slug} />
			</div>
		</main>
	)
}
