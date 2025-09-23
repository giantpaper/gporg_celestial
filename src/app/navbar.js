'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { font__accent }  from '../utils/fonts.js';
import Image from 'next/image';

const NavLinks = [
	{ id: 1, name: 'Blog', path: '/' },
	{ id: 2, name: 'About', path: '/about' },
	{ id: 3, name: 'Contact', path: '/contact' },
];

const Navbar = () => {
	const pathname = usePathname();
	const isActive = (path) => path === pathname;
	const BLOG_TITLE = process.env.NEXT_PUBLIC_WP_TITLE

	return (
		<nav className={`bg-black pt-8 text-center ${font__accent.className}`}>
			<div className="navbar bg-white pb-24">
				<div className="flex items-center container mx-auto py-2">
					<Link href="/">
						<div className="sr-only">{BLOG_TITLE}</div>
						<span className="logo">
							<Image
								src="/assets/images/GPORG_logo.svg"
								alt="Giantpaper.org"
								width={100}
								height={100}
								/>
						</span>
					</Link>
					<ul className="flex justify-center w-full gap-4 lg:gap-16 lg:pr-[87.09px]">
						{NavLinks.map((link) => {
							return (
								<li key={link.id}>
									<Link
										href={link.path}
										className={isActive(link.path) ? 'active' : ''}
									>
										{link.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
