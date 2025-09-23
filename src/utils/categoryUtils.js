// utils/categoryUtils.js
export async function getCategoryHierarchy() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/categories?per_page=10`
	);
	const categories = await response.json();
	
	// Create a map for quick lookup
	const categoryMap = new Map();
	categories.forEach(cat => {
		categoryMap.set(cat.id, cat);
	});
	
	// Function to build full path for a category
	const buildCategoryPath = (categoryId) => {
		const path = [];
		let currentCat = categoryMap.get(categoryId);
		
		while (currentCat) {
			path.unshift(currentCat.slug); // Add to beginning
			if (currentCat.parent === 0) break; // No parent
			currentCat = categoryMap.get(currentCat.parent);
		}
		
		return path;
	};
	// NEW: Function to build display hierarchy
	const buildCategoryDisplay = (categoryId) => {
		const names = [];
		let currentCat = categoryMap.get(categoryId);
		
		while (currentCat) {
			names.unshift(`<a href="${currentCat.link.replace(/^https?:\/\/([^/]+)\//, '')}">${currentCat.name}</a>`); // Use .name instead of .slug
			if (currentCat.parent === 0) break;
			currentCat = categoryMap.get(currentCat.parent);
		}
		
		return names.join(' &rsaquo; '); // Join with > separator
	};
	
	return { categoryMap, buildCategoryPath, buildCategoryDisplay, };
}