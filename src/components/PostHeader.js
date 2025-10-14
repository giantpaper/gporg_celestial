import PostCategory from './PostCategory.js';
import { font__accent } from '../utils/fonts.js';

export default function PostFooter (props) {
	return (
		<div className={`post-header z-10 ${font__accent.className}`}>
			<PostCategory post={props.post} categoryData={props.categoryData} />
		</div>
	)
}