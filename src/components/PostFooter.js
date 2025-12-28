import Link from 'next/link';
import PostTime from './PostTime.js';
import PostTags from './PostTags.js';
import { font__accent } from '../utils/fonts.js';

export default function PostFooter ({post, permalink, className = ''}) {
	const tags = post._embedded?.['wp:term']?.[1] || [];
	return (
		<div className={`post-footer flex flex-col gap-2 order-2 ${font__accent.className} ${className}`}>
			{permalink ? ( // If a permalink was given
				<Link href={permalink}><PostTime datetime={post.date} /></Link> // Link the date to it
			) : ( // Otherwise output the date without the link
				<PostTime datetime={post.date} />
			)}
			{tags.length > 0 && <PostTags tags={tags} />}
		</div>
	);
}