'use client'

import { useEffect } from 'react';

export default function PostPhotoblogImg (props) {
	let tmp
	useEffect(() => {
		let img = props.post.content.rendered;
		tmp = document.createElement('div.tmp-img');
		tmp.innerHTML = img
		tmp.querySelector(`img:first-of-type`).classList.add(`post-image`, `aspect-square`, `order-1`,
			`w-full`, `md:w-50`, `lg:w-3/5`,
			`shadow-[1rem_1rem_0_lightblue]`, `md:shadow-[1.5rem_1.5rem_0_lightblue]`, `lg:shadow-[2rem_2rem_0_lightblue]`, `object-cover`, `rounded-xl`);
	}, [])
	return null;
}