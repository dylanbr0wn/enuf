'use client'

import { useEffect, useRef } from 'react'

function PageResizer() {
	useEffect(() => {
		function setSize() {
			let portraitMode = window.innerHeight > window.innerWidth
			var vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
			document.documentElement.style.setProperty('--vh', `${vh}px`)
			if (
				(portraitMode === true && window.innerHeight < window.innerWidth) ||
				(portraitMode === false && window.innerHeight > window.innerWidth)
			) {
				portraitMode = window.innerHeight > window.innerWidth
				document
					.querySelector('meta[name=viewport]')
					?.setAttribute(
						'content',
						'width=' +
							window.innerWidth +
							', height=' +
							window.innerHeight +
							', initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
					)
			}
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
