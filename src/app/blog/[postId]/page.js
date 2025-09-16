const page = async ({ params }) => {
	const post = await getSinglePost(params.postId);
	return (
		<div className="single-blog-page">
			<h2>{post.title.rendered}</h2>
			<div className="blog-post" dangerouslySetInnerHTML={{ __html: post.content.rendered }}>
			</div>
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
