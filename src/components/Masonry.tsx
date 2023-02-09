import MasonryLayout from 'react-masonry-css';
import noPinsImage from '../assets/images/icons/no-pins.svg';
import { breakPoints } from '../constants/masonry';
import SinglePin from './SinglePin';

function Masonry(props: MasonryProps) {
	if (!props.pins.length) {
		return (
			<div className='font-bold items-center text-center text-1xl mt-6'>
				<img
					src={noPinsImage}
					alt='no pins found'
					className='w-508 mx-auto mb-7'
				/>
				<p>No Pins Found!</p>
			</div>
		);
	}

	return (
		<MasonryLayout
			className='flex animate-slide-fwd'
			breakpointCols={breakPoints}
		>
			{props.pins.map((pin, index) => (
				<SinglePin key={pin._id} pin={pin} />
			))}
		</MasonryLayout>
	);
}

export default Masonry;
