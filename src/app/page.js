import Link from 'next/link';
import { font__accent, font__default } from '../utils/fonts.js';
import { getCategoryHierarchy } from '../utils/categoryUtils';
import postTitle from '../utils/postTitle.js';
import Conditional from '../utils/Conditional.js'

import Post from '../components/Post.js';

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
			<p>All blog posts are fetched from WordPress via the WP REST API.</p>
			<div className="posts flex gap-12 lg:gap-24 flex-col">
				{posts.map((post) => {
					const categoryId = post.categories[0];
					const categoryPath = buildCategoryPath(categoryId);
					const permalink = `/${categoryPath.join('/')}/${post.id}/${post.slug}`;
					const title = postTitle(post)
					
					// Feat. Image
					const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
					const featuredImageURL = featuredMedia?.source_url;
					const featuredImageAlt = featuredMedia?.alt_text || post.title.rendered;
					
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
								<div className={`post w-full flex flex-col items-center gap-4 md:gap-8 lg:gap-12 xl:gap-20 ${categoryPath.join(' ')}`} key={post.id}>
									<h2 className={`post-title text-xl order-0 ${font__accent.className}`}>
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
						case 'linklog':
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