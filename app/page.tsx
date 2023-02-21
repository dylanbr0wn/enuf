import { InsertForm } from '@/components/insert-form'
import { ItemList } from '@/components/item-list'
import { PageResizer } from '@/components/page-resizer'
import { createClient } from '@/lib/supabase-server'
import { Todo, todosSchema } from '@/lib/zod'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'todo',
	description: 'when everything is to much but you need to do it anyway',
	viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-content',
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

type UnparseList =
	| {
			id: string
			todos: any | any[]
	  }
	| {
			id: string
			todos: any | any[]
	  }[]

function parseLists<T extends UnparseList>(item: T) {
	if (Array.isArray(item)) {
		return item.map((list) => ({
			id: list.id,
			todos: todosSchema
				.parse(Array.isArray(list.todos) ? list.todos : [list.todos])
				.sort((a, b) => ('' + a.sort_rank).localeCompare(b.sort_rank ?? '')),
		}))
	} else {
		return [
			{
				id: item.id,
				todos: todosSchema
					.parse(Array.isArray(item.todos) ? item.todos : [item.todos])
					.sort((a, b) => ('' + a.sort_rank).localeCompare(b.sort_rank ?? '')),
			},
		]
	}
}

async function getLists() {
	const supabase = createClient()
	const {
		data: { session },
	} = await supabase.auth.getSession()
	const { data, error } = await supabase
		.from('lists_users')
		.select('lists (id, todos(*))')
		.eq('user_id', session?.user.id)
		.limit(1)
		.single()

	if (error) console.log(error)
	if (!data?.lists) {
		console.log('no list')
		const { data: newList } = await supabase.from('lists').insert({}).select()
		const { data, error } = await supabase
			.from('lists_users')
			.insert({ list_id: newList?.[0].id ?? '', user_id: session?.user.id ?? '', is_owner: true })
			.select('lists (id, todos(*))')
		if (error) console.log(error)
		if (data?.[0].lists) return parseLists(data[0].lists)
		else {
			return []
		}
	} else return parseLists(data.lists)
}

// do not cache this page
export const revalidate = 0

export default async function Home() {
	const lists = await getLists()

	return (
		<main
			className="mx-auto grid h-full w-full gap-1 pt-[4.25rem]"
			style={{ gridTemplateRows: '1fr auto' }}
		>
			<ItemList list={lists[0]} />
			<div className="z-20 w-screen bg-white/50 backdrop-blur dark:bg-neutral-900/50">
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
				<div className="mx-auto max-w-3xl shrink-0 py-5 duration-500 delay-500">
					<InsertForm listId={lists[0].id} placeholder={getRandomPlaceholder()} />
				</div>
			</div>
			<PageResizer />
		</main>
	)
}
