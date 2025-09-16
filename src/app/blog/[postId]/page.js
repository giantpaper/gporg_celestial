export async function generateStaticParams() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts`
	);
	const posts = await response.json();

	return posts.map((post) => ({
		postId: post.id.toString(),
	}));
}

const page = async ({ params }) => {
	const post = await getSinglePost(params.postId);
	return (
		<div className="single-blog-page">
			<h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h2>
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
