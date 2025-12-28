import { getCategoryHierarchy } from '../utils/categoryUtils';

import PostsList from '../components/PostsList.js'

const Homepage = async () => {
	const perPage = 10;

	const [postsResponse, categoryData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=${perPage}&page=1`),
		getCategoryHierarchy()
	]);

	const posts = await postsResponse.json();
	const totalPages = parseInt(postsResponse.headers.get('X-WP-TotalPages') || '1', 10);

	return (
		<div className="blog-page">
			<h1>What's the Latest?</h1>
			<div className="posts flex gap-12 lg:gap-36 flex-col">
				{posts.map((post) => {
					return <PostsList key={post.id} post={post} categoryData={categoryData} />;
				})}
			</div>

			{totalPages > 1 && (
				<nav className="pagination flex gap-4 justify-center mt-12">
					<span>Page 1 of {totalPages}</span>
					<a href="/page/2" className="next">Next</a>
				</nav>
			)}
		</div>
	);

};

export default Homepage;
