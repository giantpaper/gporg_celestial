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
	const [postsResponse, pagesResponse, categoryData] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=100`),
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/pages?per_page=100`), // Fetch pages
		getCategoryHierarchy()
	]);
	const posts = await postsResponse.json();
	const pages = await pagesResponse.json();
	const { buildCategoryPath, categoryMap } = categoryData;
		
	const params = [];
	
	// Generate post URLs
	posts.forEach((post) => {
		// Get the category (assuming first category)
		const categoryId = post.categories[0];
		const categoryPath = buildCategoryPath(categoryId);
		const fullSlug = [...categoryPath, post.id.toString(), post.slug];
		params.push({ slug: fullSlug });
	});
	// Generate page URLs (single segment)
	pages.forEach(page => {
		params.push({ slug: [page.slug] });
	});
	// Generate category URLs (single segment)
	Array.from(categoryMap.values()).forEach(category => {
		params.push({ slug: [category.slug] });
	});
	
	return params;
}

const page = async ({ params }) => {
	const { slug } = params;
	const categoryData = await getCategoryHierarchy();
	
	// Route based on slug length and content
	if (slug.length === 1) {
		// Single segment: could be page or category
		return await handleSingleSegment(slug[0], categoryData);
	} else if (slug.length >= 4) {
		// Multi-segment: it's a post
		return await handlePost(slug, categoryData);
	} else {
		return <div>Page not found</div>;
	}
};

// Handle single-segment URLs (pages vs categories)
async function handleSingleSegment(segment, categoryData) {
	// Try to fetch as a WordPress page first
	try {
		const pageResponse = await fetch(
			`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/pages?slug=${segment}`
		);
		const pages = await pageResponse.json();
		
		if (pages.length > 0) {
			const page = pages[0];
			return (
				<div className="page single">
					<h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }}></h1>
					<div className="page-content prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }}></div>
				</div>
			);
		}
	} catch (error) {
		console.log('Not a page, trying category...');
	}
	
	// If not a page, try as a category
	const { categoryMap } = categoryData;
	const category = Array.from(categoryMap.values()).find(cat => cat.slug === segment);
	
	if (category) {
		// Fetch posts in this category
		const postsResponse = await fetch(
			`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?categories=${category.id}&_embed`
		);
		const posts = await postsResponse.json();
		
		return (
			<div className="category-archive">
				<h1>{category.name}</h1>
				{category.description && <p className="text-gray-600">{category.description}</p>}
				
				<div className="posts">
					{posts.map(post => (
						<article key={post.id} className="mb-8">
							{/* Render post preview - similar to your homepage */}
							<h2>
								<a href={`/${buildPostPermalink(post, categoryData)}`}>
									<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
								</a>
							</h2>
							<div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}></div>
						</article>
					))}
				</div>
			</div>
		);
	}
	
	return <div>Page not found</div>;
}

// Handle multi-segment URLs (posts)
async function handlePost(slug, categoryData) {
	const postIdIndex = slug.findIndex(segment => !isNaN(segment) && segment.length > 0);
	
	if (postIdIndex === -1 || postIdIndex === slug.length - 1) {
		return <div>Post not found</div>;
	}
	
	const postId = slug[postIdIndex];
	const postname = slug[postIdIndex + 1];
	const post = await getSinglePost(postId);
	const title = postTitle(post);
	
	if (post.slug !== postname) {
		return <div>Post not found</div>;
	}
	
	// Move your renderPostContent logic here
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
			case 'photoblog':
				return (
					<div className={`post single w-full flex flex-col items-center gap-4 md:gap-8 lg:gap-12 ${slug.join(' ')}`} key={post.id}>
						<h2 className={`post-title text-xl w-3/5 mx-auto text-center order-0`} dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-6 text-center" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostPhotoblogImg post={post} />
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
			case 'linklog':
				return (
					<div className="post single">	
						<PostHeader post={post} categoryData={categoryData} />
						<h2 className="post-title text-2xl inline-block mx-auto !mb-16" dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-6" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
			default:
				return (
					<div className="post single">
						<h2 className="post-title" dangerouslySetInnerHTML={{ __html: title }}></h2>
						<div className="post-content max-w-3xl prose leading-8" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
						<PostFooter post={post} categoryData={categoryData} />
					</div>
				);
		}
	};
	
	return (
		<>
			<HeadingClassApplier />
			{renderPostContent()}
		</>
	);
}

// Helper function to build post permalink
function buildPostPermalink(post, categoryData) {
	const { buildCategoryPath } = categoryData;
	const categoryId = post.categories[0];
	const categoryPath = buildCategoryPath(categoryId);
	return `${categoryPath.join('/')}/${post.id}/${post.slug}`;
}

async function getSinglePost(postId) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts/${postId}`
	);
	const post = await response.json();
	return post;
}

export default page;
