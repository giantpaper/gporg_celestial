"use client"

import { useEffect } from 'react';

export default function HeadingClassApplier() {
	useEffect(() => {
		// Your DOM manipulation code here
		document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(tag) {
			const existingClass = tag.getAttribute('class') || '';
			
			// Check if it already has h0-h6 class
			if (!existingClass.match(/(^| )h[0-6]($| )/)) {
				tag.classList.add(tag.tagName.toLowerCase()); // h1, h2, etc.
			}
		});
	}, []); // Run once when component mounts

	// This component doesn't render anything visible
	return null;
}