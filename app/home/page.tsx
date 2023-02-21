import Auth from '@/components/auth'
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'todo',
	description: 'when everything is to much but you need to do it anyway',
	viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-content',
}

export default async function Home() {
	return (
		<main className="h-full">
			<div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center ">
				<div className=" py-12 font-bold text-neutral-700 dark:text-neutral-200">
					<div className="mt-1 whitespace-nowrap text-5xl">
						If you&apos;ve had <h1 className="inline font-thin text-black dark:text-white">enuf</h1>{' '}
						of
					</div>
					<br />
					<span className="text-3xl font-normal">piles of cluter,</span>
					<br />
					<span className="text-3xl font-normal">endless unused features,</span>
					<br />
					<span className="text-3xl font-normal">unreachable promise of productivity,</span>
					<br />
					<span className="text-3xl font-normal">nonstop stream of distractions,</span>
					<br />
					<span className="text-3xl font-normal">constant need to be connected,</span>
					<br />
					<span className="text-3xl font-normal">over designed UI,</span>
					<br />
					<span className="text-3xl font-normal">insane pricing models,</span>
					<br />
					<span className="text-3xl font-normal">losing all your shit,</span>
					<br />
					<span className="text-3xl font-normal">bugs bugs bugs bugs bugs bugs,</span>
					<br />
					<span className="text-3xl font-normal">{'{{ insert todo list problem here }}'},</span>
					<br />
					<span className="text-sm font-normal text-neutral-700">you get the point</span>
				</div>
				<div className="flex gap-3 py-3">
					<Link href="/login">
						<Button className="text-lg" variant="default" size="lg">
							<span>Try something new?</span>
						</Button>
					</Link>
				</div>
				<div>
					<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-xs hover:underline">
						na, I like hurt
					</a>
				</div>
			</div>
		</main>
	)
}
