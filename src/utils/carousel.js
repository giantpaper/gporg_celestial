'use client'
import { useEffect } from 'react'

export default function Carousel () {
	useEffect(() => {
		let galleries = document.querySelectorAll('.wp-block-gallery')
		
		galleries.forEach(gallery => {
			const total = gallery.children.length - 2
			
			if (gallery.querySelector('button:first-child') === null) {
				function setActive (gallery) {
					gallery.setAttribute('data-active', 1)
					let btnPrev = document.createElement('button')
						btnPrev.classList.add('pn', 'prev')
						btnPrev.setAttribute('aria-label', 'Previous')
					let btnNext = document.createElement('button')
						btnNext.classList.add('pn', 'next')
						btnNext.setAttribute('aria-label', 'Next')
					gallery.prepend(btnPrev)
					gallery.append(btnNext)
					
					return gallery
				}
				function checkActive(gallery) {
					let active = parseInt(gallery.getAttribute('data-active'))
					
					switch (active) {
						case 1:
							gallery.querySelector('.prev').classList.add('!opacity-0')
						break
						case total:
							gallery.querySelector('.next').classList.add('!opacity-0')
						break
						default:
							gallery.querySelector('.prev').classList.remove('!opacity-0')
							gallery.querySelector('.next').classList.remove('!opacity-0')
					}
					return gallery
				}
				
				gallery = setActive(gallery)
				gallery = checkActive(gallery)
				
				document.addEventListener('mouseup', function(e){
					let target = e.target
					let direction = 1
					if (target.classList.contains('prev')) {
						gallery.setAttribute('data-active', active--)
					}
					else if (target.classList.contains('next')) {
						gallery.setAttribute('data-active', active++)
						direction = -1
					}
					
					let figure = gallery.querySelector('figure')
					let width = figure.clientWidth
					figure.style.transition = `margin-left 0.2s`
					figure.style.marginLeft = `${width * active * direction}px`
					console.log(figure)
				})
			}
		})
	})
}