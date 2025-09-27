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
		const categoryPath = buildCategoryPath(category.id);
		
		// Add the full category path (e.g., ['paper', 'information'])
		params.push({ slug: categoryPath });
		
		// Also add all parent paths (e.g., ['paper'])
		for (let i = 1; i < categoryPath.length; i++) {
			const parentPath = categoryPath.slice(0, i);
			// Check if this parent path already exists to avoid duplicates
			const pathExists = params.some(param => 
				param.slug.length === parentPath.length && 
				param.slug.every((seg, idx) => seg === parentPath[idx])
			);
			if (!pathExists) {
				params.push({ slug: parentPath });
			}
		}
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
		// Multi-segment with numeric ID: it's a post
		const hasNumericSegment = slug.some(segment => !isNaN(segment) && segment.length > 0);
		if (hasNumericSegment) {
			return await handlePost(slug, categoryData);
		} else {
			// Multi-segment without numeric ID: it's a hierarchical category
			return await handleCategoryArchive(slug, categoryData);
		}
	} else if (slug.length >= 2) {
		// 2-3 segments: could be hierarchical category
		return await handleCategoryArchive(slug, categoryData);
	} else {
		return <div>Page not found</div>;
	}
};
// Handle multi-segment category URLs
async function handleCategoryArchive(slug, categoryData) {
	const { categoryMap } = categoryData;
	
	// Find category that matches this path
	const category = Array.from(categoryMap.values()).find(cat => {
		const catPath = buildCategoryPath(cat.id);
		return catPath.length === slug.length && 
					 catPath.every((segment, index) => segment === slug[index]);
	});
	
	if (category) {
		// Fetch posts in this category (including subcategories)
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
	
	return <div>Category not found</div>;
}

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

async function getSinglePost(postId) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts/${postId}`
	);
	const post = await response.json();
	return post;
}

export default page;
