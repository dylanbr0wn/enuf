import { Check, GripVertical, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { AnimatePresence, motion, Variants, Reorder, useDragControls } from 'framer-motion'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDragStore, useListStore } from '@/lib/zustand'
import { Todo } from '@/lib/zod'
import { Separator } from './separator'
import { PrioritySelector } from './priority-selector'
import { Tag } from './tag'
import { getTags, getTitle } from '@/lib/utils'
import { useSupabase } from './supabase-provider'

type ItemProps = {
	item: Todo
	clickHandler: (id: string) => void
	onDragEnd: (id: string) => void
	index: number
}

const variants: Variants = {
	hidden: { opacity: 0, height: 58 },
	visible: { opacity: 1, height: 58 },
	open: { opacity: 1, height: 256 },
}

function Item({ item, clickHandler, onDragEnd, index }: ItemProps) {
	const { supabase } = useSupabase()
	const [checked, setChecked] = useState(false)

	const { setLastDragged, setDragging, dragging, lastDragged } = useDragStore((s) => ({
		setLastDragged: s.setLastDragged,
		setDragging: s.setDragging,
		dragging: s.dragging,
		lastDragged: s.lastDragged,
	}))

	const [prevIndex, setPrevIndex] = useState(index)

	const formRef = useRef<HTMLFormElement>(null)

	const { update, selected, setFilters } = useListStore((s) => ({
		update: s.update,
		selected: s.selected,
		setFilters: s.setFilters,
	}))
	const controls = useDragControls()

	const {
		handleSubmit,
		register,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			title: getTitle(item.title),
		},
		resolver: zodResolver(
			z.object({
				title: z.string().min(1).max(100),
			})
		),
	})

	function onChecked() {
		setChecked(true)
		clickHandler(item.id)
	}

	useEffect(() => {
		reset({ title: getTitle(item.title) })
	}, [item.title, reset])

	async function onSubmit(data: { title: string }) {
		if (!isDirty) return
		const tags = getTags(item.title)
			.map((t) => '$' + t)
			.join('')
		const newTitle = data.title + tags
		update((old) => {
			const index = old.findIndex((i) => i.id === item.id)
			old[index].title = newTitle
			return old
		})
		reset({ title: getTitle(newTitle) })
		await supabase.from('todos').update({ title: newTitle }).eq('id', item.id)
	}

	function handleDragStart(e: React.PointerEvent<HTMLButtonElement>, index: number) {
		controls.start(e)
		setLastDragged(item.id)
		setDragging(true)
		setPrevIndex(index)
	}

	function handleDragEnd() {
		setDragging(false)

		if (prevIndex !== index) onDragEnd(item.id)
	}

	async function deleteTag(tag: string) {
		const fullTag = '$' + tag
		const newTitle = item.title.replace(fullTag, '')
		setFilters((old) => old.filter((f) => (f.type === 'tag' && f.value === tag ? false : true)))
		update((old) => {
			const index = old.findIndex((i) => i.id === item.id)
			old[index].title = newTitle
			return old
		})
		await supabase.from('todos').update({ title: newTitle }).eq('id', item.id)
	}

	return (
		<AnimatePresence>
			<Reorder.Item
				value={item}
				dragListener={false}
				dragControls={controls}
				layout
				onDragEnd={handleDragEnd}
				aria-disabled={dragging && lastDragged !== item.id}
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
				data-selected={selected === index}
				className="relative flex w-full items-center gap-1 rounded-lg border border-transparent  bg-white  px-4 py-2 shadow-black/10 hover:border-neutral-300 aria-disabled:pointer-events-none data-[selected='true']:border-neutral-600 hover:data-[selected='true']:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:data-[selected='true']:border-neutral-400"
			>
				<Checkbox checked={checked} onCheckedChange={onChecked} className="z-10" />
				<form
					ref={formRef}
					onSubmit={handleSubmit(onSubmit)}
					className="z-10 flex w-1/2 items-center gap-2"
				>
					<div className="w-full">
						<Input
							{...register('title')}
							className="w-full border-transparent"
							onBlur={handleSubmit(onSubmit)}
						/>
						<Separator
							orientation="horizontal"
							className="w-full origin-left translate-y-[-1px] scale-x-0 bg-neutral-700 transition-transform peer-focus:scale-x-100 dark:bg-neutral-300"
						/>
					</div>
				</form>
				<div className="grow" />
				<div className="flex gap-1">
					{getTags(item.title).map((tag) => (
						<Tag tag={tag} key={tag} deleteTag={deleteTag} />
					))}
				</div>
				<Button
					variant="ghost"
					size="sm"
					data-grabed={dragging && lastDragged === item.id}
					className="cursor-grab touch-none text-neutral-400 data-[grabed='true']:cursor-grabbing dark:text-neutral-500"
					onPointerDown={(e) => handleDragStart(e, index)}
					onPointerUp={() => setDragging(false)}
				>
					<GripVertical className="h-4 w-4 " />
				</Button>
			</Reorder.Item>
		</AnimatePresence>
	)
}
export { Item }
