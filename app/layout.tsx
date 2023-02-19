import './globals.css'
import { Inter_Tight } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { cn } from '@/lib/utils'

const inter_tight = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					' bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-900 dark:text-neutral-50',
					inter_tight.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
