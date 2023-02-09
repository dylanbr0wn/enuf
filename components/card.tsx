import { cn } from '@/lib/utils'

type CardProps = {
	children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

function Card({ children, className, ...props }: CardProps) {
	return (
		<div
			className={cn(
				'flex w-full flex-col gap-4 rounded-lg border border-neutral-200/50 bg-white/50 p-5 shadow-xl shadow-cyan-200/10 backdrop-blur fill-mode-both',
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}

export { Card }
