import Auth from '@/components/auth'
import { Card } from '@/components/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'todo',
	description: 'when everything is to much but you need to do it anyway',
	viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-content',
}

export default async function Home() {
	return (
		<main className="h-full">
			<div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-12 ">
				<div className="w-96 text-black"></div>
			</div>
		</main>
	)
}
