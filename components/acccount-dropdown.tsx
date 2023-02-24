'use client'

import { LogOut, Monitor, Moon, Sun, User, Zap } from 'lucide-react'
import { Button } from './button'
import useSwr from 'swr'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './dropdown-menu'
import { useSupabase } from './supabase-provider'
import { useUser } from '@/lib/hooks'

function AccountDropdown() {
	const { supabase } = useSupabase()
	async function logout() {
		await supabase.auth.signOut()
	}

	const { user } = useUser()

	if (!user) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm">
					<User className="pointer-events-auto h-4 w-4 text-neutral-700 dark:text-neutral-200" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="pointer-events-auto">
				<DropdownMenuLabel>
					<span>{user?.details?.username}</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout} className="flex items-center gap-2">
					<LogOut className="h-4 w-4" />
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export { AccountDropdown }
