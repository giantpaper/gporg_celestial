import Link from 'next/link';
import { font__accent, font__default } from '../utils/fonts.js';
import { getCategoryHierarchy } from '../utils/categoryUtils';
import postTitle from '../utils/postTitle.js';
import Conditional from '../utils/Conditional.js'

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
			<div className="posts flex gap-8 flex-col">
				{posts.map((post) => {
					const categoryId = post.categories[0];
					const categoryPath = buildCategoryPath(categoryId);
					const permalink = `/${categoryPath.join('/')}/${post.id}/${post.slug}`;
					const title = postTitle(post)
					
					// Feat. Image
					const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
					const featuredImageURL = featuredMedia?.source_url;
					const featuredImageAlt = featuredMedia?.alt_text || post.title.rendered;
					
					return (
						<Link href={permalink} className="post w-full grid grid-rows-2 grid-cols-[500px_auto] items-center gap-4" key={post.id}>
							<div className="post-text order-1 flex flex-col gap-6 justify-center">
								<h2 dangerouslySetInnerHTML={{ __html: title }} className={`post-title text-xl ${font__accent.className}`}></h2>
								<Conditional showWhen={post.excerpt.rendered}>
									<div
										dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
										className="order-2"
									></div>
								</Conditional>
							</div>
							<div className="post-image order-0 w-[500px] row-span-2">
								<img
									className="aspect-square w-[500px] object-cover rounded-xl"
									src={featuredImageURL}
									alt={featuredImageAlt}
								/>
							</div>
						</Link>
					);
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