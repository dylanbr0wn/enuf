'use client'

import { Monitor, Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'
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

function ThemeSelector() {
	const { theme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<Moon className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel className="flex gap-2">
					<span>Theme</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={theme} onValueChange={(val) => setTheme(val)}>
					<DropdownMenuRadioItem value="light" className="flex gap-2">
						<Sun className="h-4 w-4" />
						<span>Light</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark" className="flex gap-2">
						<Moon className="h-4 w-4" />
						<span>Dark</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system" className="flex gap-2">
						<Monitor className="h-4 w-4" />
						<span>System</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export { ThemeSelector }
