'use client'
import { useEffect } from 'react'

export default function micropostMods() {
	useEffect(() => {
		document.querySelectorAll('.post.microblog').forEach(post => {
			let content = post.querySelector('.post-title-content')
			let figure = content.querySelector('figure')
			// Add .featured class
			content.querySelector('figure').classList.add('featured')
			// Move featured element to the top of the post
			content.querySelector('.post-title').before(figure)
		})
	})
}