'use client'

import { useEffect } from 'react'

function PageResizer() {
	useEffect(() => {
		function setSize() {
			var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
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
