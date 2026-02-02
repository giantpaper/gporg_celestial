import { getCategoryHierarchy } from '../../utils/categoryUtils';
import postTitle from '../../utils/postTitle.js';
import PostFooter from '../../components/PostFooter.js';
import PostPhotoblogImg from '../../components/PostPhotoblogImg.js';
import PostHeader from '../../components/PostHeader.js';
import HeadingClassApplier from '../../components/HeadingClassApplier';
import PostsList from '../../components/PostsList.js'

import Mods from '../../utils/mods.js'

import MicropostMods from '../../utils/micropostMods.js'

export async function generateStaticParams() {
	// Function to fetch all posts with pagination
	async function fetchAllPosts() {
		let allPosts = [];
		let page = 1;
		let hasMore = true;
		let perPage = 10;
		
		while (hasMore) {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=${perPage}&page=${page}`
			);
			
			if (!response.ok) {
				console.error('Failed to fetch posts:', await response.text());
				break;
			}
			
			const posts = await response.json();
			
			if (posts.length === 0) {
				hasMore = false;
			} else {
				allPosts = allPosts.concat(posts);
				page++;
			}
			
			// Safety check to prevent infinite loops
			if (page > 50) { // Adjust based on your needs (50 pages = 5000 posts max)
				console.warn('Reached maximum page limit');
				break;
			}
		}
		
		return allPosts;
	}
	
	// Per Lux:
	// generateStaticParams() can only return URL parameters that match your dynamic segments
	const [allPosts, pagesResponse, categoryData, tagsResponse] = await Promise.all([
		fetchAllPosts(),
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/pages?per_page=100`),
		getCategoryHierarchy(),
		fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/tags?per_page=100`)
	]);
	const pages = await pagesResponse.json();
	const tags = await tagsResponse.json();
	const { buildCategoryPath, categoryMap } = categoryData;
		
	const params = [];
	
	// Generate post URLs
	allPosts.forEach((post) => {
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

	// Generate tag URLs: /tag/[tag_slug] and /tag/[tag_slug]/[page_num]
	const postsPerPage = 10;
	tags.forEach(tag => {
		// Page 1: /tag/[tag_slug]
		params.push({ slug: ['tag', tag.slug] });

		// Additional pages: /tag/[tag_slug]/2, /tag/[tag_slug]/3, etc.
		const totalPages = Math.ceil(tag.count / postsPerPage);
		for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
			params.push({ slug: ['tag', tag.slug, pageNum.toString()] });
		}
	});

	// Generate homepage pagination URLs: /page/2, /page/3, etc.
	// (Page 1 is handled by src/app/page.js)
	const homepageTotalPages = Math.ceil(allPosts.length / postsPerPage);
	for (let pageNum = 2; pageNum <= homepageTotalPages; pageNum++) {
		params.push({ slug: ['page', pageNum.toString()] });
	}

	return params;
}

const page = async ({ params }) => {
	const { slug } = params;
	const categoryData = await getCategoryHierarchy();

	// Check for tag routes: /tag/[tag_slug] or /tag/[tag_slug]/[page_num]
	if (slug[0] === 'tag' && slug.length >= 2) {
		const tagSlug = slug[1];
		const pageNum = slug.length >= 3 ? parseInt(slug[2], 10) : 1;
		return await handleTagArchive(tagSlug, pageNum, categoryData);
	}

	// Check for homepage pagination: /page/2, /page/3, etc.
	if (slug[0] === 'page' && slug.length === 2 && !isNaN(slug[1])) {
		const pageNum = parseInt(slug[1], 10);
		return await handleHomepagePagination(pageNum, categoryData);
	}

	// Route based on slug length and content
	if (slug.length === 1) {
		// Single segment: could be page or category
		return await handleSingleSegment(slug[0], categoryData);
	} else if (slug.length >= 2) {
		// Multi-segment: check for numeric ID to determine if it's a post
		const hasNumericSegment = slug.some(segment => !isNaN(segment) && segment.length > 0);
		if (hasNumericSegment) {
			// Has numeric segment: it's a post (e.g., /photoblog/11043/slug or /paper/subcategory/123/slug)
			return await handlePost(slug, categoryData);
		} else {
			// No numeric segment: it's a hierarchical category
			return await handleCategoryArchive(slug, categoryData);
		}
	} else {
		return <div>Page not found</div>;
	}
};
// Handle multi-segment category URLs
async function handleCategoryArchive(slug, categoryData) {
	const { categoryMap, buildCategoryPath } = categoryData; // Add buildCategoryPath here
	
	// Find category that matches this path
	const category = Array.from(categoryMap.values()).find(cat => {
		const catPath = buildCategoryPath(cat.id); // Now this will work
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
			<>
				<Mods />
				<div className="category-archive">
					<h1>{category.name}</h1>
					{category.description && <p className="text-gray-600">{category.description}</p>}

					<div className="posts">
						{posts.map(post => (
							<PostsList key={post.id} post={post} categoryData={categoryData} />
						))}
					</div>
				</div>
			</>
		);
	}

	return <div>Category not found</div>;
}

// Handle tag archive URLs: /tag/[tag_slug] or /tag/[tag_slug]/[page_num]
async function handleTagArchive(tagSlug, pageNum, categoryData) {
	const perPage = 10;

	// Fetch tag by slug
	const tagResponse = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/tags?slug=${tagSlug}`
	);
	const tags = await tagResponse.json();

	if (!tags.length) {
		return <div>Tag not found</div>;
	}

	const tag = tags[0];

	// Fetch posts with this tag
	const postsResponse = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?tags=${tag.id}&_embed&per_page=${perPage}&page=${pageNum}`
	);
	const posts = await postsResponse.json();
	const totalPages = parseInt(postsResponse.headers.get('X-WP-TotalPages') || '1', 10);

	return (
		<>
			<Mods />
			<div className="tag-archive">
				<h1>#{tag.name}</h1>
				{tag.description && <div className="text-gray-600 mb-8" dangerouslySetInnerHTML={{__html: tag.description.replace(/\n/g, "<br />") }}></div>}

				<div className="posts flex gap-12 lg:gap-36 flex-col">
					{posts.map(post => (
						<PostsList key={post.id} post={post} categoryData={categoryData} />
					))}
				</div>

				{totalPages > 1 && (
					<nav className="pagination flex gap-4 justify-center mt-12">
						{pageNum > 1 && (
							<a href={pageNum === 2 ? `/tag/${tagSlug}` : `/tag/${tagSlug}/${pageNum - 1}`} className="prev">Previous</a>
						)}
						<span>Page {pageNum} of {totalPages}</span>
						{pageNum < totalPages && (
							<a href={`/tag/${tagSlug}/${pageNum + 1}`} className="next">Next</a>
						)}
					</nav>
				)}
			</div>
		</>
	);
}

// Handle homepage pagination: /page/2, /page/3, etc.
async function handleHomepagePagination(pageNum, categoryData) {
	const perPage = 10;

	const postsResponse = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=${perPage}&page=${pageNum}`
	);
	const posts = await postsResponse.json();
	const totalPages = parseInt(postsResponse.headers.get('X-WP-TotalPages') || '1', 10);

	return (
		<>
			<Mods />
			<div className="blog-page">
				<h1>What's the Latest?</h1>
				<div className="posts flex gap-12 lg:gap-36 flex-col">
					{posts.map(post => (
						<PostsList key={post.id} post={post} categoryData={categoryData} />
					))}
				</div>

				{totalPages > 1 && (
					<nav className="pagination flex gap-4 justify-center mt-12">
						{pageNum > 1 && (
							<a href={pageNum === 2 ? '/' : `/page/${pageNum - 1}`} className="prev">Previous</a>
						)}
						<span>Page {pageNum} of {totalPages}</span>
						{pageNum < totalPages && (
							<a href={`/page/${pageNum + 1}`} className="next">Next</a>
						)}
					</nav>
				)}
			</div>
		</>
	);
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
				<>
					<Mods />
					<div className="page single">
						<h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }}></h1>
						<div className="page-content prose" dangerouslySetInnerHTML={{ __html: page.content.rendered }}></div>
					</div>
				</>
			);
		}
	} catch (error) {
		// Not a page, will try as category below
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
			<>
				<Mods />
				<div className="category-archive">
					<h1>{category.name}</h1>
					{category.description && <p className="text-gray-600">{category.description}</p>}

					<div className="posts flex gap-12 lg:gap-36 flex-col">
						{posts.map(post => (
							<PostsList key={post.id} post={post} categoryData={categoryData} />
						))}
					</div>
				</div>
			</>
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
						<figure className="post-image-container"><PostPhotoblogImg post={post} /></figure>
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
			<Mods />
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
