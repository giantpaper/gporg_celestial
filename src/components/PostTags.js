import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-82e0c091db/icons';

export default function PostTags({ tags }) {
	return (
		<div className="flex gap-2 items-center mb-4 last:mb-0">
			<FontAwesomeIcon icon={byPrefixAndName.fass['tags']} className="w-6" />
			<div className="flex gap-2 flex-wrap">
				{tags.map((tag) => (
					<a 
						key={tag.id}
						href={`/tag/${tag.slug}`}
					>
						#{tag.name.replace(/[\- ]/g, '')}
					</a>
				))}
			</div>
		</div>
	);
}