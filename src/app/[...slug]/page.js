import { getCategoryHierarchy } from '../../utils/categoryUtils';
import postTitle from '../../utils/postTitle.js';
import PostFooter from '../../components/PostFooter.js';
import PostPhotoblogImg from '../../components/PostPhotoblogImg.js';
import PostHeader from '../../components/PostHeader.js';
import HeadingClassApplier from '../../components/HeadingClassApplier'; // Imp
import { font__accent, font__default, font__fancy } from '../../utils/fonts.js';

export async function generateStaticParams() {
	// Per Lux:
	// generateStaticParams() can only return URL parameters that match your dynamic segments
	const [postsResponse, categoryData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=100`),
		getCategoryHierarchy()
	]);
	const posts = await postsResponse.json();
	const { buildCategoryPath } = categoryData;
	
	return posts.map((post) => {
		// Get the category (assuming first category)
		const categoryId = post.categories[0];
		const categoryPath = buildCategoryPath(categoryId);
		const fullSlug = [...categoryPath, post.id.toString(), post.slug];
		
		return {
			slug: fullSlug // e.g., ['paper', 'information', '4904', 'hello-world']
		};
	});
}

const page = async ({ params }) => {
	const { slug } = params;
	
	// Fetch categoryData in the component instead
	const categoryData = await getCategoryHierarchy();
	
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
	// Fetch post-type specific title formatting
	const title = postTitle(post);
	// Optional: Validate the postname matches
	if (post.slug !== postname) {
		return <div>Post not found</div>;
	}
	
	const renderPostContent = () => {
		switch (slug[0]) {
			case 'paper':
				return (
					<div className="post single">	
						<PostHeader post={post} categoryData={categoryData} />
						<h2 className="post-title text-2xl inline-block mx-auto !mb-4" dangerouslySetInnerHTML={{ __html: title }}></h2>
						<PostFooter post={post} categoryData={categoryData} className="mb-16" />
						<div className="post-content max-w-3xl prose leading-6" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
					</div>
				);
				break;
			case 'photoblog':
				return (
					<div className={`post single w-full flex flex-col items-center gap-4 md:gap-8 lg:gap-12 ${slug.join(' ')}`} key={post.id}>
						<h2 className={`post-title text-xl w-3/5 mx-auto text-center order-0`} dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-6 text-center" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostPhotoblogImg post={post} />
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
				break;
			case 'linklog':
				return (
					<div className="post single">	
						<PostHeader post={post} categoryData={categoryData} />
						<h2 className="post-title text-2xl inline-block mx-auto !mb-16" dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-6" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
				break;
			default:
				return (
					<div className="post single">
						<h2 className="post-title" dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-8" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
		}
	} 
	
	return (
		<>
			<HeadingClassApplier />
			{renderPostContent()}
		</>
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
