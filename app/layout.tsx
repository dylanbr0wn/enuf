import './globals.css'
import { Inter_Tight } from '@next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

const inter_tight = Inter_Tight({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body
				className={cn(
					'min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-900 dark:text-neutral-50',
					inter_tight.variable
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div
						className=" grid h-screen w-full"
						style={{
							gridTemplateRows: 'auto 1fr auto',
						}}
					>
						<Header />
						<div className=" h-full w-full">{children}</div>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
