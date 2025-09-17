export default function postTitle(post) {
	const category = post.categories[0];
	let title = post.title.rendered;
	
	switch (category) {
		case 11:	// IF /linklog/
			title = title.replace(/(&#8220;)(.+)(&#8221;)/, `<span class="linklog-dq">$1</span>$2<span class="linklog-dq">$3</span>`);
			break;
	}
	
	return title;
}