'use client'
import { useEffect } from 'react'

export default function Carousel () {
	useEffect(() => {
		let galleries = document.querySelectorAll('.wp-block-gallery')
		
		galleries.forEach(gallery => {
			if (gallery.querySelector('button:first-child') === null) {
				gallery.setAttribute('data-active', 1)
				let btnPrev = document.createElement('button')
					btnPrev.classList.add('pn', 'prev')
					btnPrev.setAttribute('aria-label', 'Previous')
				let btnNext = document.createElement('button')
					btnNext.classList.add('pn', 'next')
					btnNext.setAttribute('aria-label', 'Next')
				gallery.prepend(btnPrev)
				gallery.append(btnNext)
				
				switch (gallery.getAttribute('data-active')) {
					case '1':
						gallery.querySelector('.prev').classList.add('hidden')
				}
				console.log(gallery.querySelector('.prev'))
			}
		})
	})
}