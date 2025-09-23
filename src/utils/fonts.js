import { Bree_Serif, Hind, Sassy_Frass } from 'next/font/google'
import localFont from 'next/font/local'
 
export const font__fancy = localFont({
	src: '../../public/assets/fonts/amalfi_coast-webfont.woff2',
	variable: '--font-fancy',
})
export const font__accent = Bree_Serif({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-accent',
})
export const font__default = Hind({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-default',
})
export const font__display = Sassy_Frass({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-display',
})