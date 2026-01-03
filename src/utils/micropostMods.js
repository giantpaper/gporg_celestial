'use client'
import { useEffect } from 'react'

export default function micropostMods() {
	useEffect(() => {
		document.querySelectorAll('.post.microblog').forEach(post => {
			post.insertBefore(post.querySelector('.content > figure'), post.querySelector('.post-title'))
		})
	})
}