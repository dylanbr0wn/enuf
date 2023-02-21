'use client'

import { LucideProps } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './button'
import { AnimatePresence, motion } from 'framer-motion'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './dropdown-menu'
import { cn } from '@/lib/utils'

const variants = {
	hidden: { opacity: 0, pathLength: 0, transition: { duration: 0.5 } },
	visible: { opacity: 1, pathLength: 1, transition: { duration: 0.5 } },
}

function Sun({ className, initial = true }: { initial?: boolean } & LucideProps) {
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			initial={initial ? 'hidden' : false}
			animate="visible"
			exit="hidden"
			className={cn('absolute top-0 left-0', className)}
		>
			<motion.circle variants={variants} cx="12" cy="12" r="4" />
			<motion.path variants={variants} d="M12 2v2" />
			<motion.path variants={variants} d="M12 20v2" />
			<motion.path variants={variants} d="m4.93 4.93 1.41 1.41" />
			<motion.path variants={variants} d="m17.66 17.66 1.41 1.41" />
			<motion.path variants={variants} d="M2 12h2" />
			<motion.path variants={variants} d="M20 12h2" />
			<motion.path variants={variants} d="m6.34 17.66-1.41 1.41" />
			<motion.path variants={variants} d="m19.07 4.93-1.41 1.41" />
		</motion.svg>
	)
}

function Moon({ className, initial = true }: { initial?: boolean } & LucideProps) {
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			initial={initial ? 'hidden' : false}
			animate="visible"
			exit="hidden"
			className={cn('absolute top-0 left-0', className)}
		>
			<motion.path variants={variants} d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</motion.svg>
	)
}

function Monitor({ className, initial = true }: { initial?: boolean } & LucideProps) {
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			initial={initial ? 'hidden' : false}
			animate="visible"
			exit="hidden"
			className={cn('absolute top-0 left-0', className)}
		>
			<motion.rect variants={variants} x="2" y="3" width="20" height="14" rx="2" ry="2" />
			<motion.line variants={variants} x1="8" y1="21" x2="16" y2="21" />
			<motion.line variants={variants} x1="12" y1="17" x2="12" y2="21" />
		</motion.svg>
	)
}

function ThemeIcon({
	theme,
	className,
	...props
}: { theme: string | undefined; initial?: boolean } & LucideProps) {
	return (
		<div className={cn('relative', className)}>
			<AnimatePresence>
				{theme === 'dark' && <Moon className={className} key="moon" {...props} />}
				{theme === 'system' && <Monitor className={className} key="monitor" {...props} />}
				{theme === 'light' && <Sun className={className} key="sun" {...props} />}
			</AnimatePresence>
		</div>
	)
}

function ThemeSelector() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<ThemeIcon theme={theme} className="h-4 w-4 " />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="pointer-events-auto">
				<DropdownMenuLabel className="flex gap-2">
					<span>Theme</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={theme} onValueChange={(val) => setTheme(val)}>
					<DropdownMenuRadioItem value="light" className="flex gap-2">
						<ThemeIcon initial={false} theme="light" className="h-4 w-4" />
						<span>Light</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark" className="flex gap-2">
						<ThemeIcon initial={false} theme="dark" className="h-4 w-4" />
						<span>Dark</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system" className="flex gap-2">
						<ThemeIcon initial={false} theme="system" className="h-4 w-4" />
						<span>System</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ThemeSelector
