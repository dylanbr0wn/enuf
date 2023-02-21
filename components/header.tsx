import { Moon, List } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { AccountDropdown } from './acccount-dropdown'
import { Button } from './button'
import { Logo } from './logo'
// import ThemeSelector from './theme-selector'
const ThemeSelector = dynamic(() => import('./theme-selector'), { ssr: false })

function Header() {
	return (
		<header className="fixed top-0 left-0 z-50 h-16 w-screen bg-white dark:bg-neutral-900">
			<div className="mx-auto flex h-full max-w-3xl items-center justify-between px-4">
				{/* <div className="flex h-full w-full items-center justify-end gap-2"></div> */}
				<div className="flex h-full w-full items-center justify-start  gap-2 ">
					<Link
						href="/"
						className="font-light tracking-widest text-neutral-700 dark:text-neutral-200"
					>
						{/* <Logo className="h-4 w-auto" /> */}
						enuf
					</Link>
				</div>

				<div className="flex h-full w-full items-center justify-end gap-2">
					<ThemeSelector />
					<AccountDropdown />
				</div>
			</div>
			<div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent " />
		</header>
	)
}
export { Header }
