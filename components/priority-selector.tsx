import { useListStore } from '@/lib/zustand'
import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	CircleDot,
	LucideProps,
} from 'lucide-react'
import { Button } from './button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './dropdown-menu'
import { useSupabase } from './supabase-provider'

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

function PrioritySelector({ id, priority }: { id: string; priority: number }) {
	const { supabase } = useSupabase()
	const update = useListStore((s) => s.update)

	async function handlePriorityChange(priority: string) {
		const newPriority = Number(priority)

		if (isNaN(newPriority)) return

		update((old) => {
			const index = old.findIndex((i) => i.id === id)
			old[index].priority = newPriority
			return old
		})
		await supabase.from('todos').update({ priority: newPriority }).eq('id', id)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="z-10 " size="sm">
					<PriorityIcon priority={priority} className="h-4 w-4 text-neutral-500" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<div className="w-36 text-sm">
					<DropdownMenuLabel>Priority</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<div className="w-36 text-sm">
						<DropdownMenuRadioGroup
							value={priority.toString()}
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
	)
}

export { PrioritySelector }
