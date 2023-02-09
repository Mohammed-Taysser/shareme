import { SanityImageAssetDocument } from '@sanity/client';
import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { client } from '../../apps/api';
import getUserInfo from '../../apps/getUserInfo';
import Spinner from '../../components/Spinner';
import { CATEGORIES } from '../../constants/category';

interface PinInfo {
	image: SanityImageAssetDocument | null;
	title: string;
	about: string;
	destination: string;
	category: string;
}

function CreatePin() {
	const navigateTo = useNavigate();
	const user = getUserInfo();
	const [pinData, setPinData] = useState<PinInfo>({
		image: null,
		title: '',
		about: '',
		destination: '',
		category: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const onFileInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedImage = evt?.target?.files?.[0];
		if (uploadedImage) {
			if (uploadedImage.type.startsWith('image')) {
				setError('');
				setIsLoading(true);
				client.assets
					.upload('image', uploadedImage, {
						contentType: uploadedImage.type,
						filename: uploadedImage.name,
					})
					.then((document) => {
						setPinData({ ...pinData, image: document });
						setIsLoading(false);
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				setError('only one image are accepted');
				setIsLoading(false);
			}
		}
	};

	const onInputChange = (
		evt:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
	) => {
		setPinData({ ...pinData, [evt.target.name]: evt.target.value });
	};

	const savePin = () => {
		if (
			pinData.title &&
			pinData.about &&
			pinData.destination &&
			pinData.image?._id &&
			pinData.category
		) {
			setError('');
			const doc = {
				_type: 'pin',
				title: pinData.title,
				about: pinData.about,
				destination: pinData.destination,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: pinData.image?._id,
					},
				},
				userId: user._id,
				postedBy: {
					_type: 'postedBy',
					_ref: user._id,
				},
				category: pinData.category,
			};
			client.create(doc).then(() => {
				navigateTo('/');
			});
		} else {
			setError('Please fill all input fields');
		}
	};

	const DropzoneChildren = () => {
		if (isLoading) {
			return <Spinner />;
		} else if (pinData?.image) {
			return (
				<div className='relative h-full'>
					<img
						src={pinData?.image?.url}
						alt={pinData.image?.originalFilename}
						className='h-full w-full'
					/>
					<button
						type='button'
						className='absolute bottom-3 right-3 p-3 rounded-full text-red-500 bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out opacity-75 hover:opacity-100'
						title='delete uploaded image'
						onClick={() => setPinData({ ...pinData, image: null })}
					>
						<MdDelete />
					</button>
				</div>
			);
		} else {
			return (
				<label className='cursor-pointer'>
					<div className='flex flex-col items-center justify-center h-full'>
						<div className='flex flex-col justify-center items-center'>
							<p className='font-bold text-2xl'>
								<AiOutlineCloudUpload />
							</p>
							<p className='text-lg'>Click to upload</p>
						</div>

						<p className='mt-32 text-gray-400 text-center'>
							Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF
							less than 20MB
						</p>
					</div>
					<input
						type='file'
						name='upload-image'
						onChange={onFileInputChange}
						className='w-0 h-0'
						accept='image/*'
					/>
				</label>
			);
		}
	};

	return (
		<div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
			<div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
				<div className='bg-secondaryColor p-3 flex flex-0.7 w-full h-full'>
					<div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
						<DropzoneChildren />
					</div>
				</div>
			</div>
			<p className='text-red-500 mb-4 transition-all duration-150 ease-in'>
				{error}
			</p>
			<div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 lg:w-4/5 w-full'>
				<input
					type='text'
					value={pinData.title}
					name='title'
					onChange={onInputChange}
					placeholder='Add your title'
					className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
				/>
				{user && (
					<div className='flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg '>
						<img
							src={user.image}
							className='w-10 h-10 rounded-full'
							alt='user-profile'
						/>
						<p className='font-bold'>{user.userName}</p>
					</div>
				)}
				<input
					type='text'
					value={pinData.about}
					name='about'
					onChange={onInputChange}
					placeholder='Tell everyone what your Pin is about'
					className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
				/>
				<input
					type='url'
					value={pinData.destination}
					name='destination'
					onChange={onInputChange}
					placeholder='Add a destination link'
					className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
				/>

				<div className='flex flex-col'>
					<select
						onChange={onInputChange}
						className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
						title='Choose Pin Category'
						name='category'
					>
						<option value='others' className='sm:text-bg bg-white p-2'>
							Select Category
						</option>
						{CATEGORIES.map((item) => (
							<option
								className='text-base border-0 outline-none capitalize bg-white text-black '
								value={item.name}
								key={item.name}
							>
								{item.name}
							</option>
						))}
					</select>
					<div className='flex justify-end items-end mt-5'>
						<button
							type='button'
							onClick={savePin}
							className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
						>
							Save Pin
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreatePin;
