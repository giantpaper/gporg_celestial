import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-82e0c091db/icons';

export default function PostTime ({datetime}) {
	return (
		<time dateTime={datetime} className="flex gap-4">
			<FontAwesomeIcon icon={byPrefixAndName.fass['calendar']} className="w-4" />
			<span>{new Date(datetime).toLocaleDateString('en-US',
				{
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}
			)}</span>
		</time>
	)
}