import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'todo',
	description: 'when everything is to much but you need to do it anyway',
	viewport: 'width=device-width, initial-scale=1, interactive-widget=resizes-content',
}

export default async function Home() {
	return (
		<main className="">
			<div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-12 ">
				<div className="blue-glow absolute top-1/2 left-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-50" />
				<div className="pink-glow absolute top-2/3 left-2/3 -z-10 h-2/3 w-2/3 -translate-x-1/2  -translate-y-1/2 opacity-30" />
				<h1 className="shrink-0 bg-gradient-to-t from-neutral-800 to-neutral-600 bg-clip-text py-10 text-6xl font-bold text-transparent animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300 fill-mode-both">
					The{' '}
					<span className="bg-gradient-to-br from-violet-500 via-sky-500 to-cyan-500 bg-clip-text font-black text-transparent">
						perfect
					</span>{' '}
					task list
				</h1>
			</div>
		</main>
	)
}
