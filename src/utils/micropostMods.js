'use client'
import { useEffect } from 'react'

export default function micropostMods() {
	useEffect(() => {
		document.querySelectorAll('.post.microblog').forEach(post => {
			let content = post.querySelector('.content')
			console.log(content.querySelector('figure'))
			//content.insertBefore(content.querySelector('figure'), post.querySelector('.post-title'))
		})
	})
}