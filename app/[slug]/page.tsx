import { Card } from '@/components/card'
import { InsertForm } from '@/components/insert-form'
import { ItemList } from '@/components/item-list'

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

type ListProps = {
	params: {
		slug: string
	}
}

export default async function List({ params }: ListProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-1 py-4 ">
			{/* <div className="blue-glow absolute top-1/2 left-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-50" />
			<div className="pink-glow absolute top-2/3 left-2/3 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-30" /> */}

			{/* <h1 className="shrink-0 bg-gradient-to-t from-neutral-800 to-neutral-600 bg-clip-text py-10 text-6xl font-bold text-transparent animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
					The{' '}
					<span className="bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-500 bg-clip-text font-black text-transparent">
						perfect
					</span>{' '}
					task list
				</h1> */}

			<ItemList listId={params.slug} />
			<div className="fixed bottom-0 w-screen bg-white/50 backdrop-blur dark:bg-neutral-900/50">
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
				<div className="mx-auto max-w-3xl shrink-0 py-5 duration-500 delay-500">
					<InsertForm listId={params.slug} placeholder={getRandomPlaceholder()} />
				</div>
			</div>
		</div>
	)
}
