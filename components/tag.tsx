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
		<div data-active={isSet} className="group flex items-center overflow-hidden text-sm">
			<button
				onClick={toggleFilter}
				className=" peer translate-x-[1px] rounded-l-lg border border-neutral-200 border-r-transparent py-0.5 pl-2 pr-1 transition-colors hover:border-neutral-400 hover:text-neutral-700 group-data-[active='true']:border-y-neutral-700 group-data-[active='true']:border-l-neutral-700 group-data-[active='true']:hover:border-neutral-700 dark:border-neutral-700 dark:border-r-transparent dark:hover:border-neutral-600 dark:hover:text-neutral-200 dark:group-data-[active='true']:border-neutral-200 dark:group-data-[active='true']:hover:border-neutral-200"
			>
				{tag}
			</button>
			<button
				onClick={() => deleteTag(tag)}
				className="h-full rounded-r-lg border border-neutral-200 p-1 outline-none ring-0 transition-colors hover:border-neutral-400 hover:text-neutral-700 peer-hover:border-l-transparent group-data-[active='true']:border-neutral-700 group-data-[active='true']:hover:border-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:text-neutral-200 dark:group-data-[active='true']:border-neutral-200 dark:group-data-[active='true']:hover:border-neutral-200"
			>
				<X className="h-3 w-3" />
			</button>
		</div>
	)
}

export { Tag }
