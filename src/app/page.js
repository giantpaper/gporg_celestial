import { getCategoryHierarchy } from '../utils/categoryUtils';

import PostsList from '../components/PostsList.js'

const Homepage = async () => {
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
