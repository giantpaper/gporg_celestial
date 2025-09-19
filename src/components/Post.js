import Conditional from '../utils/Conditional.js';

export default function Post(p) {
	let post = p
	const categoryId = post.categories[0];
	const categoryPath = buildCategoryPath(categoryId);
	const permalink = `/${categoryPath.join('/')}/${post.id}/${post.slug}`;
	const title = postTitle(post)
	
	// Feat. Image
	/*const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
	const featuredImageURL = featuredMedia?.source_url;
	const featuredImageAlt = featuredMedia?.alt_text || post.title.rendered;
	*/
	
	const {
		featuredMedia,
		featuredImageURL,
		featuredImageAlt
	} = FeaturedMedia(post);
	return (
		<>
			<div className="post-text order-1 flex flex-col gap-6 justify-center
				w-full md:w-50 lg:w-3/5
			">
				<h2 className={`post-title text-xl ${font__accent.className}`}>
					<Link href={permalink} dangerouslySetInnerHTML={{ __html: title }}></Link>
				</h2>
				<Conditional showWhen={post.excerpt.rendered}>
					<div
						dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
						className="order-2"
					></div>
				</Conditional>
			</div>
			<Conditional showWhen={featuredImageURL}>
				<img
					className="post-image aspect-square order-0
						w-full md:w-50 lg:w-2/5
						shadow-[1rem_1rem_0_lightblue] md:shadow-[1.5rem_1.5rem_0_lightblue] lg:shadow-[2rem_2rem_0_lightblue]
						object-cover rounded-xl"
					src={featuredImageURL}
					alt={featuredImageAlt}
				/>
			</Conditional>
		</>
	)
}