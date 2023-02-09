import { Todo } from '@/app/page'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Card } from './card'
import { Checkbox } from './checkbox'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Input } from './input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useListStore } from '@/lib/zustand'
import { supabase } from '@/lib/supabase'

type ItemProps = {
	item: Todo
	clickHandler: (id: string) => void
	loading: boolean
}

const variants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
}

function Item({ item, loading, clickHandler }: ItemProps) {
	const [checked, setChecked] = useState(false)
	const [open, setOpen] = useState(false)

	const update = useListStore((s) => s.update)

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

	async function onSubmit(data: { title: string | null }) {
		update((old) => {
			const index = old.findIndex((i) => i.id === item.id)
			old[index].title = data.title ?? ''
			return old
		})
		reset({ title: data.title })
		await supabase.from('todos').update({ title: data.title }).eq('id', item.id)
	}

	return (
		<AnimatePresence>
			{!open ? (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					layout
					layoutId={`card-${item.id}`}
					className="w-full"
				>
					<motion.div
						layout="position"
						variants={variants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="flex w-full flex-col gap-4 rounded-lg border border-neutral-200/50 bg-white/50 p-5 shadow-xl shadow-cyan-200/10 backdrop-blur animate-in fade-in duration-500 fill-mode-both hover:border-sky-300"
					>
						<motion.div
							layout="position"
							className="relative flex h-full w-full items-center gap-3"
						>
							<div className="z-10 h-full shrink-0">
								<Checkbox checked={checked} onCheckedChange={onChecked} />
							</div>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="pointer-events-none z-10 flex items-center gap-2"
							>
								<Input
									{...register('title')}
									className="pointer-events-auto w-fit shrink border-transparent hover:border-slate-300 focus:border-slate-300"
								/>
								{isDirty && (
									<>
										<Button
											type="submit"
											size="sm"
											className="pointer-events-auto z-10"
											// className="text-slate-500 hover:text-slate-400 focus:text-slate-400"
										>
											<Check className=" h-4 w-4" />
										</Button>
										<Button
											type="button"
											size="sm"
											variant="outline"
											onClick={() => reset()}
											className="pointer-events-auto z-10"
											// className="text-slate-500 hover:text-slate-400 focus:text-slate-400"
										>
											<X className="h-4 w-4" />
										</Button>
									</>
								)}
							</form>

							<button
								title="Open card"
								className="absolute top-0 left-0 z-0 h-full w-full cursor-pointer"
								onClick={() => setOpen(true)}
							/>
							{/* <Button disabled={loading} onClick={() => clickHandler(item.id)} variant="ghost">
					<X className="h-5 w-5 text-neutral-500" />
				</Button> */}
						</motion.div>
					</motion.div>
				</motion.div>
			) : (
				<>
					<motion.div
						variants={variants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						layout
						layoutId={`card-${item.id}`}
						className="fixed top-1/3  z-30 mx-auto h-1/3 w-full max-w-3xl"
					>
						<motion.div
							layout="position"
							variants={variants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="flex h-full  w-full  flex-col gap-4 rounded-lg border border-neutral-200/50 bg-white p-5 shadow-xl shadow-cyan-200/10 backdrop-blur  animate-in fade-in duration-500 fill-mode-both"
						>
							<motion.div layout="position" className="flex w-full items-center gap-3">
								<Checkbox checked={checked} onCheckedChange={onChecked} />
								<span className="text-lg text-neutral-600">{item.title}</span>
								{/* <Button disabled={loading} onClick={() => clickHandler(item.id)} variant="ghost">
        <X className="h-5 w-5 text-neutral-500" />
      </Button> */}
							</motion.div>
						</motion.div>
					</motion.div>
					<div
						onClick={() => setOpen(false)}
						className="fixed top-0 left-0 h-full w-full bg-black/40 animate-in fade-in"
					/>
				</>
			)}
		</AnimatePresence>
	)
}
export { Item }
