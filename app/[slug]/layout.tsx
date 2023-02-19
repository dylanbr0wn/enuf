export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main
			className="main mx-auto grid w-full gap-1 pt-[4.25rem]"
			style={{ gridTemplateRows: '1fr auto' }}
		>
			{children}
		</main>
	)
}
