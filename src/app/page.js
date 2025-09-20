import Link from 'next/link';
import { font__accent, font__default, font__fancy } from '../utils/fonts.js';
import { getCategoryHierarchy } from '../utils/categoryUtils';
import postTitle from '../utils/postTitle.js';
import Conditional from '../utils/Conditional.js'
import FeaturedMedia from '../utils/FeaturedMedia.js'

async function getPosts() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts`
	);
	const posts = await response.json();
	return posts;
}

const Homepage = async () => {
//	const posts = await getPosts();
	const [postsResponse, categoryData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=10`),
		getCategoryHierarchy()
	]);
	
	const posts = await postsResponse.json();
	const { buildCategoryPath } = categoryData;
	
	return (
		<div className="blog-page">
			<h1>What's the Latest?</h1>
			<div className="posts flex gap-12 lg:gap-36 flex-col">
				{posts.map((post) => {
					const categoryId = post.categories[0];
					const categoryPath = buildCategoryPath(categoryId);
					const permalink = `/${categoryPath.join('/')}/${post.id}/${post.slug}`;
					const title = postTitle(post)
					
					// Feat. Image
					const {
						featuredMedia,
						featuredImageURL,
						featuredImageAlt
					} = FeaturedMedia(post);
					
					switch (categoryPath[0]) {
						case 'paper':	// The Paper
							return (
								<div className={`post w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12 xl:gap-20 ${categoryPath.join(' ')}`} key={post.id}>
									<div className="post-text order-1 flex flex-col gap-6 justify-center
										w-full md:w-50 lg:w-3/5
									">
										<h2 className={`post-title text-xl ${font__accent.className}`}>
											<Link href={permalink} dangerouslySetInnerHTML={{ __html: title }}></Link>
										</h2>
										<Conditional showWhen={post.excerpt.rendered}>
											<div
												dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
												className="order-2"
											></div>
										</Conditional>
									</div>
									<Conditional showWhen={featuredImageURL}>
										<img
											className="post-image aspect-square order-0
												w-full md:w-50 lg:w-2/5
												shadow-[1rem_1rem_0_lightblue] md:shadow-[1.5rem_1.5rem_0_lightblue] lg:shadow-[2rem_2rem_0_lightblue]
												object-cover rounded-xl"
											src={featuredImageURL}
											alt={featuredImageAlt}
										/>
									</Conditional>
								</div>
							);
							break;
						case 'photoblog':
							return (
								<div className={`post w-full flex flex-col items-center gap-4 md:gap-8 lg:gap-12 ${categoryPath.join(' ')}`} key={post.id}>
									<h2 className={`post-title text-xl w-3/5 mx-auto text-center rotate-[-1deg] order-0`}>
										<Link href={permalink} dangerouslySetInnerHTML={{ __html: title }}></Link>
									</h2>
									<Conditional showWhen={featuredImageURL}>
										<img
											className="post-image aspect-square order-1
												w-full md:w-50 lg:w-2/5
												shadow-[1rem_1rem_0_lightblue] md:shadow-[1.5rem_1.5rem_0_lightblue] lg:shadow-[2rem_2rem_0_lightblue]
												object-cover rounded-xl"
											src={featuredImageURL}
											alt={featuredImageAlt}
										/>
									</Conditional>
								</div>
							);
							break;
						case 'microblog':
							return (
								<div className={`post w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12 xl:gap-20 mx-auto ${categoryPath.join(' ')}`} key={post.id}>
									<div className="post-text order-1
										w-full md:w-50 lg:w-3/5
									">
										<h2 className={`post-title text-xl inline float-left mr-1 ${font__accent.className}`}>
											<Link href={permalink} dangerouslySetInnerHTML={{ __html: title }}></Link>
										</h2>
										<Conditional showWhen={post.excerpt.rendered}>
											<div
												dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
												className="order-2 inline text-xl"
											></div>
										</Conditional>
									</div>
									<Conditional showWhen={featuredImageURL}>
										<img
											className="post-image aspect-square order-0
												w-full md:w-50 lg:w-2/5
												shadow-[1rem_1rem_0_lightblue] md:shadow-[1.5rem_1.5rem_0_lightblue] lg:shadow-[2rem_2rem_0_lightblue]
												object-cover rounded-xl"
											src={featuredImageURL}
											alt={featuredImageAlt}
										/>
									</Conditional>
								</div>
							);
							break;
						case 'linklog':
							const postLink = post.acf.external_url;
							let domain = postLink.replace(/^https:\/\/([^\/]+)(?:\/.+)?$/, '$1');
							return (
								<div className={`post w-full flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-12 xl:gap-20 ${categoryPath.join(' ')}`} key={post.id}>
									<div className="post-text order-1 flex flex-col gap-6 justify-center
										w-full md:w-50 lg:w-3/5
									">
										<h2 className={`post-title text-xl ${font__accent.className}`}>
											<Link href={postLink} dangerouslySetInnerHTML={{ __html: title }} target="_blank" rel="noopener"></Link>
										</h2>
										<p className="text-sm -mt-4 font-accent inline-flex gap-2">
											<a href={postLink} target="_blank" rel="noopener">{domain}</a>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4"><path d="M352 88C352 101.3 362.7 112 376 112L494.1 112L263.1 343C253.7 352.4 253.7 367.6 263.1 376.9C272.5 386.2 287.7 386.3 297 376.9L528 145.9L528 264C528 277.3 538.7 288 552 288C565.3 288 576 277.3 576 264L576 88C576 74.7 565.3 64 552 64L376 64C362.7 64 352 74.7 352 88zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 408C480 394.7 469.3 384 456 384C442.7 384 432 394.7 432 408L432 496C432 513.7 417.7 528 400 528L144 528C126.3 528 112 513.7 112 496L112 240C112 222.3 126.3 208 144 208L232 208C245.3 208 256 197.3 256 184C256 170.7 245.3 160 232 160L144 160z"/></svg>
										</p>
										<Conditional showWhen={post.excerpt.rendered}>
											<div
												dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
												className="order-2"
											></div>
										</Conditional>
									</div>
									<Conditional showWhen={featuredImageURL}>
										<img
											className="post-image aspect-square order-0
												w-full md:w-50 lg:w-2/5
												shadow-[1rem_1rem_0_lightblue] md:shadow-[1.5rem_1.5rem_0_lightblue] lg:shadow-[2rem_2rem_0_lightblue]
												object-cover rounded-xl"
											src={featuredImageURL}
											alt={featuredImageAlt}
										/>
									</Conditional>
								</div>
							);
							break;
					}
				})}
			</div>
		</div>
	);
					
};

export default Homepage;


/* import Link from 'next/link';

const page = () => {
	return (
		<div className="hero">
			<h2>Next.js + Headless WordPress</h2>
			<p>
				This combination empowers seamless integration between Next.js and
				WordPress, providing dynamic and efficient web experiences.
			</p>
			<Link href="/blog" className="btn">
				Read Blog Posts
			</Link>
		</div>
	);
};

export default page;
*/