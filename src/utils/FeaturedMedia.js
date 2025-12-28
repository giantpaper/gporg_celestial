export default function FeaturedMedia(post) {
	const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
	const featuredImageURL = featuredMedia?.source_url;
	const featuredImageAlt = featuredMedia?.alt_text || post.title.rendered;
	
	return {
		featuredMedia,
		featuredImageURL,
		featuredImageAlt
	};
}