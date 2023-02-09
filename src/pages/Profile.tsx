import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {
	client,
	userCreatedPinsQuery,
	userQuery,
	userSavedPinsQuery,
} from '../apps/api';
import { googleLogout } from '@react-oauth/google';
import getUserInfo from '../apps/getUserInfo';
import { AiOutlineLogout } from 'react-icons/ai';
import Masonry from '../components/Masonry';

const activeTapStyles =
	'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveTapStyles =
	'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

function Profile() {
	const navigateTo = useNavigate();
	const { userId } = useParams();
	const userInfo = getUserInfo();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTap, setActiveTap] = useState('created');
	const [pins, setPins] = useState<Pin[]>([]);

	useEffect(() => {
		if (userId) {
			client
				.fetch(userQuery(userId))
				.then((response) => {
					setUser(response[0]);
					setIsLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [userId]);

	useEffect(() => {
		let query = null;
		if (activeTap === 'created') {
			query = userCreatedPinsQuery(userId || '');
		} else {
			query = userSavedPinsQuery(userId || '');
		}

		client
			.fetch(query)
			.then((data) => {
				setPins(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [activeTap, userId]);

	const onLogoutBtnClick = () => {
		googleLogout();
		localStorage.removeItem('shareme-user');
		navigateTo('/login');
	};

	if (isLoading) {
		return <Spinner msg='Loading User Profile ...' />;
	} else if (user) {
		return (
			<div className='relative pb-2 h-full justify-center items-center'>
				<div className='flex flex-col pb-5'>
					<div className='relative flex flex-col mb-7'>
						<div className='flex flex-col justify-center items-center'>
							<img
								className=' w-full h-370 2xl:h-510 shadow-lg object-cover'
								src='https://source.unsplash.com/1600x900/?nature,photography,technology'
								alt='random user cover'
							/>
							<img
								className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
								src={user.image}
								alt={user.userName}
							/>
						</div>
						<h1 className='font-bold text-3xl text-center mt-3'>
							{user.userName}
						</h1>
						{userInfo && (
							<div className='absolute top-0 z-1 right-0 p-2'>
								{userId === userInfo._id && (
									<button
										type='button'
										className=' bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
										onClick={onLogoutBtnClick}
										title='logout'
									>
										<AiOutlineLogout color='red' fontSize={21} />
									</button>
								)}
							</div>
						)}
					</div>
					<div className='text-center mb-7'>
						<button
							type='button'
							onClick={() => {
								setActiveTap('created');
							}}
							className={`${
								activeTap === 'created' ? activeTapStyles : notActiveTapStyles
							}`}
						>
							Created
						</button>
						<button
							type='button'
							onClick={() => {
								setActiveTap('saved');
							}}
							className={`${
								activeTap === 'saved' ? activeTapStyles : notActiveTapStyles
							}`}
						>
							Saved
						</button>
					</div>

					<div className='px-2'>
						<Masonry pins={pins} />
					</div>
				</div>
			</div>
		);
	} else {
		return <div>No user exist</div>;
	}
}

export default Profile;
