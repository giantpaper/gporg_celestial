import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-82e0c091db/icons';

export default function PostCategory({post, categoryData}) {
	const { buildCategoryDisplay } = categoryData;
	const categoryId = post.categories[0];
	const categoryText = buildCategoryDisplay(categoryId);
	return (
		<p className="m-0 flex gap-4">
			<span dangerouslySetInnerHTML={{__html: categoryText}}></span>
		</p>
	);
}