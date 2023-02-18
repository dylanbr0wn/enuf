import { useCallback, useEffect, useState } from 'react'

export function useOnKeyPress(
	targetKeys: KeyboardEvent['key'],
	callback: () => void,
	{ shift = false, ctrl = false, alt = false, meta = false } = {}
) {
	const downHandler = useCallback(
		(ev: KeyboardEvent) => {
			// ev.preventDefault()

			const { key } = ev

			if (key === targetKeys) {
				if (shift && !ev.shiftKey) return
				if (ctrl && !ev.ctrlKey) return
				if (alt && !ev.altKey) return
				if (meta && !ev.metaKey) return
				callback()
			}
		},
		[alt, callback, ctrl, shift, targetKeys, meta]
	)

	useEffect(() => {
		window.addEventListener('keydown', downHandler)

		return () => {
			window.removeEventListener('keydown', downHandler)
		}
	}, [downHandler])
}
