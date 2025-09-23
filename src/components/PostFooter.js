import Link from 'next/link';
import PostTime from './PostTime.js';
import PostTags from './PostTags.js';
import { font__accent } from '../utils/fonts.js';

export default function PostFooter (props) {
	const tags = props.post._embedded?.['wp:term']?.[1] || [];
	return (
		<div className={`post-footer flex flex-col gap-2 order-2 ${font__accent.className}`}>
			<Link href={props.permalink}><PostTime datetime={props.post.date} /></Link>
			
			{tags.length > 0 && <PostTags tags={tags} />}
		</div>
	);
}