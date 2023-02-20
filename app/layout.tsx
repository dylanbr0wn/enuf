import './globals.css'
import { Inter_Tight } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { cn } from '@/lib/utils'
import SupabaseProvider from '@/components/supabase-provider'
import SupabaseListener from '@/components/supabase-listener'
import { createClient } from '@/lib/supabase-server'

const inter_tight = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const supabase = createClient()

	const {
		data: { session },
	} = await supabase.auth.getSession()

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					' bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-900 dark:text-neutral-50',
					inter_tight.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<SupabaseProvider>
						<SupabaseListener serverAccessToken={session?.access_token} />
						<Header />
						{children}
					</SupabaseProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
