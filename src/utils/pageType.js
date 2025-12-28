export default function getPageType(slug) {
	// Single segment: could be page or category
	if (slug.length === 1) {
		return `pageORCategory`;
	// Multi-segment with numeric ID: it's a post
	} else if (slug.length >= 4) {
		const hasNumericSegment = slug.some(segment => !isNaN(segment) && segment.length > 0);
		// Multi-segment with numeric ID: it's a post
		if (hasNumericSegment) {
			return `post`
		// Multi-segment without numeric ID: it's a hierarchical category
		} else {
			return ``
		}
	}
	
}