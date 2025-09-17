import Link from 'next/link';
import { getCategoryHierarchy } from '../utils/categoryUtils';
import postTitle from '../utils/postTitle.js';

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
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed`),
		getCategoryHierarchy()
	]);
	
	const posts = await postsResponse.json();
	const { buildCategoryPath } = categoryData;
	
	return (
		<div className="blog-page">
			<h2>All Blog Posts</h2>
			<p>All blog posts are fetched from WordPress via the WP REST API.</p>
			<div className="posts">
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
						<Link href={permalink} className="post" key={post.id}>
							<h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
							<div
								dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
							></div>
							<div className="post-image order-0">
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