import { getCategoryHierarchy } from '../utils/categoryUtils';

import PostsList from '../components/PostsList.js'

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
	
	return (
		<div className="blog-page">
			<h1>What's the Latest?</h1>
			<div className="posts flex gap-12 lg:gap-36 flex-col">
				{posts.map((post) => {
					return <PostsList post={post} categoryData={categoryData} />;
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