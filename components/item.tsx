import {
	Check,
	X,
	MoreHorizontal,
	ChevronsUp,
	ChevronsDown,
	ChevronDown,
	Circle,
	ChevronUp,
	LucideIcon,
	LucideProps,
	CircleDot,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Card } from './card'
import { Checkbox } from './checkbox'
import { AnimatePresence, motion, Variants, Reorder, useDragControls } from 'framer-motion'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useListStore } from '@/lib/zustand'
import { supabase } from '@/lib/supabase'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './dropdown-menu'
import { Todo } from '@/lib/zod'

type ItemProps = {
	item: Todo
	clickHandler: (id: string) => void
	loading: boolean
	selected: boolean
	onDragEnd: (id: string) => void
	index: number
	setLastDragged: (id: string) => void
}

const variants: Variants = {
	hidden: { opacity: 0, height: 58 },
	visible: { opacity: 1, height: 58 },
	open: { opacity: 1, height: 256 },
}

function Item({
	item,
	loading,
	clickHandler,
	selected,
	onDragEnd,
	index,
	setLastDragged,
}: ItemProps) {
	const [checked, setChecked] = useState(false)
	const [open, setOpen] = useState(false)
	const [initialIndex, setInitialIndex] = useState(index)

	const update = useListStore((s) => s.update)
	const controls = useDragControls()

	const {
		handleSubmit,
		register,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			title: item.title,
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
		reset({ title: item.title })
	}, [item.title, reset])

	async function onSubmit(data: { title: string | null }) {
		update((old) => {
			const index = old.findIndex((i) => i.id === item.id)
			old[index].title = data.title ?? ''
			return old
		})
		reset({ title: data.title ?? '' })
		await supabase.from('todos').update({ title: data.title }).eq('id', item.id)
	}

	async function handlePriorityChange(priority: string) {
		const newPriority = Number(priority)

		if (isNaN(newPriority)) return

		update((old) => {
			const index = old.findIndex((i) => i.id === item.id)
			old[index].priority = newPriority
			return old
		})
		await supabase.from('todos').update({ priority: newPriority }).eq('id', item.id)
	}

	function handleDragStart(e: React.PointerEvent<HTMLDivElement>, index: number) {
		controls.start(e)
		setInitialIndex(index)
		setLastDragged(item.id)
	}

	return (
		<AnimatePresence>
			<Reorder.Item
				value={item}
				dragListener={false}
				dragControls={controls}
				variants={variants}
				initial="hidden"
				animate={open ? 'open' : 'visible'}
				exit="hidden"
				layout
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
				data-selected={selected}
				className="relative flex w-full flex-col justify-start gap-4 rounded-lg border border-transparent bg-white px-4 py-2  shadow-black/10  hover:bg-neutral-100 data-[selected='true']:bg-neutral-100  dark:bg-neutral-900 dark:hover:bg-neutral-800  "
			>
				<motion.div
					layout
					className=" flex w-full items-center gap-3"
					onPointerDown={(e) => handleDragStart(e, index)}
					onPointerUp={(e) => onDragEnd(item.id)}
				>
					<Checkbox checked={checked} onCheckedChange={onChecked} className="z-10" />
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="pointer-events-none z-10 flex items-center gap-2"
					>
						<Input
							{...register('title')}
							className="pointer-events-auto w-fit shrink border-transparent hover:border-neutral-300 focus:border-neutral-300 dark:border-transparent dark:hover:border-neutral-600 dark:focus:border-neutral-600"
						/>
						{isDirty && (
							<>
								<Button type="submit" size="sm" className="pointer-events-auto z-10">
									<Check className=" h-4 w-4" />
								</Button>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={() => reset()}
									className="pointer-events-auto z-10"
								>
									<X className="h-4 w-4" />
								</Button>
							</>
						)}
					</form>
					<div className="grow" />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="z-10 " size="sm">
								<PriorityIcon priority={item.priority} className="h-4 w-4 text-neutral-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<div className="w-36 text-sm">
								<DropdownMenuLabel>Priority</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="w-36 text-sm">
									<DropdownMenuRadioGroup
										value={item.priority.toString()}
										onValueChange={handlePriorityChange}
									>
										<DropdownMenuRadioItem value="4" className="flex items-center gap-3">
											<PriorityIcon priority={4} className="h-4 w-4" />
											<span>Highest</span>
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="3" className="flex items-center gap-3">
											<PriorityIcon priority={3} className="h-4 w-4" />
											<span>High</span>
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="2" className="flex items-center gap-3">
											<PriorityIcon priority={2} className="h-4 w-4 " />
											<span>Medium</span>
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="1" className="flex items-center gap-3">
											<PriorityIcon priority={1} className="h-4 w-4" />
											<span>Low</span>
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="0" className="flex items-center gap-3">
											<PriorityIcon priority={0} className="h-4 w-4" />
											<span>Lowest</span>
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</motion.div>
				{/* <button
					title="Open card"
					className="absolute top-0 left-0 z-0 h-full w-full cursor-pointer"
					onClick={() => setOpen((open) => !open)}
				/> */}
			</Reorder.Item>
		</AnimatePresence>
	)
}
export { Item }

function PriorityIcon({ priority, ...props }: { priority: number } & LucideProps) {
	const icons: ((props: LucideProps) => JSX.Element)[] = [
		(props) => <ChevronsDown key="0" {...props} />,
		(props) => <ChevronDown key="1" {...props} />,
		(props) => <CircleDot key="2" {...props} />,
		(props) => <ChevronUp key="3" {...props} />,
		(props) => <ChevronsUp key="4" {...props} />,
	]

	const Icon = icons[priority]

	return <Icon {...props} />
}
