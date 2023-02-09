import React, { useState } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { TbDownload } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client, urlFor } from '../apps/api';
import getUserInfo from '../apps/getUserInfo';

function SinglePin(props: { pin: Pin }) {
	const navigateTo = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
	const userInfo = getUserInfo();

	const isSaved = Boolean(
		props.pin?.save?.filter((item) => item.postedBy._id === userInfo?._id)
			?.length
	);

	const savePen = (
		evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string
	) => {
		if (!isSaved) {
			evt.stopPropagation();
			client
				.patch(id)
				.setIfMissing({ save: [] })
				.insert('after', 'save[-1]', [
					{
						_key: uuidv4(),
						userId: userInfo?._id,
						postedBy: {
							_type: 'postedBy',
							_ref: userInfo?._id,
						},
					},
				])
				.commit()
				.then((res) => {
					window.location.reload();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const deletePen = (
		evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string
	) => {
		if (!isSaved) {
			evt.stopPropagation();
			client
				.delete(id)
				.then((res) => {
					window.location.reload();
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	return (
		<div className='w-full p-2'>
			<div
				className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => navigateTo(`/pins/${props.pin._id}`)}
			>
				<img
					src={urlFor(props.pin.image).width(250).url() || ''}
					alt={props.pin.title}
					className='rounded-lg w-full'
				/>
				{isHovered && (
					<div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
						<div className='flex items-center justify-between'>
							<div className='flex gap-2'>
								<a
									href={`${urlFor(props.pin.image).url()}?dl=`}
									onClick={(evt) => evt.stopPropagation()}
									className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none'
									title={props.pin.title}
									download
								>
									<TbDownload />
								</a>
							</div>
							<button
								type='button'
								className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
								onClick={(evt) => savePen(evt, props.pin._id)}
							>
								{isSaved ? `${props.pin.save?.length} Saved` : 'Save'}
							</button>
						</div>
						<div className='flex justify-between items-center gap-2 w-full'>
							{props.pin.destination && (
								<a
									href={props.pin.destination}
									target='_blank'
									title={props.pin.destination}
									rel='noreferrer noopener'
									className='bg-white text-black items-center flex gap-2 font-bold p-3 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
								>
									<BiLinkExternal />
								</a>
							)}
							{props.pin.postedBy._id === userInfo?._id && (
								<button
									type='button'
									className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold p-3 text-base rounded-3xl hover:shadow-md outline-none'
									onClick={(evt) => deletePen(evt, props.pin._id)}
									title='delete pin'
								>
									<RiDeleteBin7Line />
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			<Link
				to={`/profile/${props.pin.postedBy._id}`}
				className='flex gap-2 items-center mt-2'
			>
				<img
					src={props.pin.postedBy.image}
					alt={props.pin.postedBy.userName}
					className='w-10 h-10 object-cover rounded-full'
				/>
				<span className='font-semibold capitalize'>
					{props.pin.postedBy.userName}
				</span>
			</Link>
		</div>
	);
}

export default SinglePin;
