'use client'

import { useEffect } from 'react'

function PageResizer() {
	useEffect(() => {
		function setSize() {
			let vh = window.innerHeight * 0.01
			document.documentElement.style.setProperty('--vh', `${vh}px`)
		}
		setSize()
		window.addEventListener('resize', setSize)
		return () => {
			window.removeEventListener('resize', setSize)
		}
	}, [])
	return null
}

export { PageResizer }
