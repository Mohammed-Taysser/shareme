import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

function Navbar(props: NavbarProps) {
	const navigateTo = useNavigate();

	return (
		<div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
			<div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
				<IoMdSearch className='ml-1 text-xl' />
				<input
					type='text'
					name='query'
					value={props.query}
					placeholder="What's in your mind !!"
					className='p-2 w-full bg-white outline-none'
					onChange={(evt) => {
						props.setQuery(evt.target.value);
						navigateTo(`/search?query=${evt.target.value}`);
					}}
				/>
			</div>
			{props.user && (
				<div className='flex gap-3'>
					<Link to={`profile/${props.user._id}`} className='hidden md:block'>
						<img
							src={props.user.image}
							alt={props.user.userName}
							className='rounded-full w-14 object-cover'
						/>
					</Link>
					<Link
						to='pins/create'
						className='bg-black text-white rounded-lg w-10 h-10 md:w-12 md:h-12 flex justify-center items-center'
					>
						<IoMdAdd />
					</Link>
				</div>
			)}
		</div>
	);
}

export default Navbar;
