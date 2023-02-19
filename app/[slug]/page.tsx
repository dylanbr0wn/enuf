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
		<div
			className="grid h-full max-h-screen w-full gap-1 pt-[4.25rem]"
			style={{ gridTemplateRows: '1fr auto' }}
		>
			<ItemList listId={params.slug} />
			<div className="z-20 w-screen bg-white/50 backdrop-blur dark:bg-neutral-900/50">
				<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
				<div className="mx-auto max-w-3xl shrink-0 py-5 duration-500 delay-500">
					<InsertForm listId={params.slug} placeholder={getRandomPlaceholder()} />
				</div>
			</div>
		</div>
	)
}
