export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div
			className=" grid"
			style={{
				gridTemplateColumns: 'auto 1fr auto',
			}}
		>
			<header />
			<main>{children}</main>
			<footer />
		</div>
	)
}
