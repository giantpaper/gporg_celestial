import { getCategoryHierarchy } from '../../utils/categoryUtils';

export async function generateStaticParams() {
	/*const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed`
	);*/
	const [postsResponse, categoryData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=100`),
		getCategoryHierarchy()
	]);
	const posts = await postsResponse.json();
	// const posts = await response.json();
	const { buildCategoryPath } = categoryData;
	
	return posts.map((post) => {
		// Get the category (assuming first category)
		const categoryId = post.categories[0];
		const categoryPath = buildCategoryPath(categoryId);
		const fullSlug = [...categoryPath, post.id.toString(), post.slug];
		//const category = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'uncategorized';
		
		return {
			slug: fullSlug // e.g., ['paper', 'information', '4904', 'hello-world']
		};
		//postId: post.id.toString(),
	});
}

const page = async ({ params }) => {
	const { slug } = params;
	
	// Parse the slug to determine what kind of page this is
	// For a post, we expect: [category...path, postId, postname]
	// The postId should be numeric, so we can identify it
	
	const postIdIndex = slug.findIndex(segment => !isNaN(segment) && segment.length > 0);
	
	if (postIdIndex === -1 || postIdIndex === slug.length - 1) {
		// No valid postId found or postId is the last segment
		return <div>Page not found</div>;
	}
	
	const postId = slug[postIdIndex];
	const postname = slug[postIdIndex + 1];
	
	// Fetch the post
	const post = await getSinglePost(postId);
	
	// Optional: Validate the postname matches
	if (post.slug !== postname) {
		return <div>Post not found</div>;
	}
	
	return (
		<div className="single-blog-page">
			<h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h2>
			<div className="blog-post" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
		</div>
	);
};

async function getSinglePost(postId) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts/${postId}`
	);
	const post = await response.json();
	return post;
}

export default page;
