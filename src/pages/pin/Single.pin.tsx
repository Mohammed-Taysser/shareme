import { useEffect, useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { TbDownload } from 'react-icons/tb';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
	client,
	pinDetailMorePinQuery,
	pinDetailQuery,
	urlFor,
} from '../../apps/api';
import getUserInfo from '../../apps/getUserInfo';
import Masonry from '../../components/Masonry';
import Spinner from '../../components/Spinner';

function PinDetails() {
	const { pinId } = useParams();
	const user = getUserInfo();
	const [isLoading, setIsLoading] = useState(true);
	const [pin, setPin] = useState<Pin | null>(null);
	const [pins, setPins] = useState<Pin[]>([]);
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);

	useEffect(() => {
		fetchPinDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pinId]);

	const fetchPinDetails = () => {
		const query = pinDetailQuery(pinId || '');

		if (query) {
			client
				.fetch(query)
				.then((pins) => {
					setPin(pins[0]);
					client
						.fetch(pinDetailMorePinQuery(pins[0]))
						.then((response) => {
							setPins(response);
							setIsLoading(false);
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(pinId || '')
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [
					{
						comment,
						_key: uuidv4(),
						postedBy: { _type: 'postedBy', _ref: user._id },
					},
				])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	if (isLoading) {
		return <Spinner msg='Loading pin ...' />;
	} else if (pin) {
		return (
			<div
				className='flex xl:flow-row flex-col m-auto bg-white rounded-3xl'
				style={{ maxWidth: '1500px' }}
			>
				<div className='flex justify-center items-center md:items-start flex-initial'>
					<img
						src={urlFor(pin.image).url()}
						alt={pin.title}
						className='rounded-t-3xl rounded-b-lg max-w-full'
					/>
				</div>
				<div className='w-full p-5 flex-1 xl:min-w-620 '>
					<div className='flex items-center justify-between'>
						<a
							href={`${urlFor(pin.image).url()}?dl=`}
							onClick={(evt) => evt.stopPropagation()}
							className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none'
							title={'download ' + pin.title}
							download
						>
							<TbDownload />
						</a>
						<a
							href={pin.destination}
							target='_blank'
							title={pin.destination}
							rel='noreferrer noopener'
							className='bg-white text-black items-center flex gap-2 font-bold p-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
						>
							<BiLinkExternal />
							{pin.destination}
						</a>
					</div>
					<div className=''>
						<h1 className='text-4xl font-bold break-words mt-3'>{pin.title}</h1>
						<p className='mt-3'>{pin.about}</p>
					</div>
					<Link
						to={`/profile/${pin.postedBy._id}`}
						className='flex gap-2 items-center mt-5 bg-white rounded-lg'
					>
						<img
							src={pin.postedBy.image}
							alt={pin.postedBy.userName}
							className='w-10 h-10 object-cover rounded-full'
						/>
						<span className='font-semibold capitalize'>
							{pin.postedBy.userName}
						</span>
					</Link>
					<h2 className='mt-5 text-2xl'>comments</h2>
					<div className='max-h-370 overflow-y-auto'>
						{pin?.comments?.map((comment, index) => (
							<div
								className='flex gap-2 mt-5 items-center bg-white rounded-lg'
								key={index}
							>
								<img
									src={comment.postedBy.image}
									alt={comment.postedBy.userName}
									className='w-10 h-10 object-cover rounded-full cursor-pointer'
								/>
								<div className='flex flex-col'>
									<p className='font-bold'>{comment.postedBy.userName}</p>
									<p>{comment.comment}</p>
								</div>
							</div>
						))}
					</div>

					{user && (
						<div className='flex flex-wrap mt-6 gap-3'>
							<Link to={`/profile/${user._id}`}>
								<img
									src={user.image}
									alt={user.userName}
									className='w-10 h-10 object-cover rounded-full'
								/>
							</Link>
							<input
								type='text'
								className='flex-1 border-gray-100 border-2 outline-none p-2 rounded-2xl focus:border-gray-300'
								placeholder='Add a comment'
								value={comment}
								onChange={(evt) => setComment(evt.target.value)}
							/>
							<button
								className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
								type='button'
								onClick={addComment}
							>
								{addingComment ? 'Posting...' : 'Post'}
							</button>
						</div>
					)}
					<div className='mt-6'>
						{pins?.length > 0 && (
							<h2 className='text-center font-bold text-2xl mt-8 mb-4'>
								More like this
							</h2>
						)}
						{pins ? (
							<Masonry pins={pins} />
						) : (
							<Spinner msg='Loading more pins' />
						)}
					</div>
				</div>
			</div>
		);
	} else {
		return <div>No pin exist</div>;
	}
}

export default PinDetails;
