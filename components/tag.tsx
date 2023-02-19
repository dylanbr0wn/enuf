import { Todo } from '@/lib/zod'
import { Filter, useListStore } from '@/lib/zustand'
import { X } from 'lucide-react'
import { Separator } from './separator'

type TagProps = {
	tag: string
	deleteTag: (tag: string) => void
}
function Tag({ tag, deleteTag }: TagProps) {
	const { setFilters, filters } = useListStore((s) => ({
		setFilters: s.setFilters,
		filters: s.filters,
	}))

	const isSet = filters.some((f) => f.value === tag && f.type === 'tag')

	function toggleFilter() {
		const newFilter: Filter = {
			value: tag,
			type: 'tag',
		}
		setFilters((prev) => {
			if (prev.some((f) => f.value === newFilter.value && f.type === newFilter.type)) {
				return prev.filter((f) => f.value !== newFilter.value && f.type !== newFilter.type)
			}
			return [...prev, newFilter]
		})
	}

	return (
		<div
			data-active={isSet}
			className="group flex items-center overflow-hidden rounded-lg border border-transparent text-sm text-neutral-500 transition-colors hover:border-neutral-400 data-[active='true']:border-neutral-700 hover:dark:border-neutral-600 dark:data-[active='true']:border-neutral-200 "
		>
			<button
				onClick={toggleFilter}
				className=" py-0.5 pl-2 pr-1 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			>
				{tag}
			</button>
			<Separator
				orientation="vertical"
				className="bg-transparent transition-colors group-hover:bg-neutral-400 dark:bg-transparent dark:group-hover:bg-neutral-600"
			/>
			<button
				onClick={() => deleteTag(tag)}
				className="h-full  p-1 outline-none ring-0 transition-colors  hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			>
				<X className="h-3 w-3" />
			</button>
		</div>
	)
}

export { Tag }
