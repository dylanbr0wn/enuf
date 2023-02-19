import { Moon, List } from 'lucide-react'
import { Button } from './button'
import { ThemeSelector } from './theme-selector'

function Header() {
	return (
		<header className="pointer-events-none fixed top-0 left-0 z-10 h-16 w-screen bg-white dark:bg-neutral-900">
			<div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
				<List className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
				<ThemeSelector />
			</div>
			<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
		</header>
	)
}
export { Header }
