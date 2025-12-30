'use client'
import { useEffect } from 'react'

export default function VideoMods() {
	useEffect(() => {
		// Find all elements with WordPress aspect ratio classes
		const aspectPattern = /wp-embed-aspect-(\d+)-(\d+)/
		const embeds = document.querySelectorAll('[class*="wp-embed-aspect-"]')

		embeds.forEach((embed) => {
			const match = embed.className.match(aspectPattern)
			if (match) {
				const width = parseInt(match[1], 10)
				const height = parseInt(match[2], 10)
				embed.style.aspectRatio = `${width} / ${height}`
				embed.style.width = '100%'
			}
		})
	}, [])

	return null
}