import { RiHomeFill } from 'react-icons/ri';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/images/icons/logo.png';
import { CATEGORIES } from '../constants/category';

const isActiveClassName =
	'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';
const isNonActiveClassName =
	'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';

function Sidebar(props: SidebarProps) {
	return (
		<div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
			<div className='flex flex-col'>
				<Link
					to='/'
					className='flex px-5 my-6 gap-2 pt-1 w-190 items-center'
					onClick={() => props.closeToggle(false)}
				>
					<img src={logo} alt='logo' className='w-full' />
				</Link>
				<div className='flex flex-col gap-5'>
					<NavLink
						to='/'
						onClick={() => props.closeToggle(false)}
						className={({ isActive }) =>
							isActive ? isActiveClassName : isNonActiveClassName
						}
					>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className='mt-2 px-5 text-base 2xl:text-xl'>
						Discover categories
					</h3>
					{CATEGORIES.slice(0, CATEGORIES.length - 1).map((cty) => (
						<NavLink
							to={`/category/${cty.name}`}
							key={cty.name}
							onClick={() => props.closeToggle(false)}
							className={({ isActive }) =>
								isActive ? isActiveClassName : isNonActiveClassName
							}
						>
							<img
								src={cty.image}
								alt={cty.name}
								className=' w-8 h-8 object-cover rounded-full shadow-sm'
							/>
							{cty.name}
						</NavLink>
					))}
				</div>
			</div>

			{props.user && (
				<div>
					<Link
						to={`/profile/${props.user._id}`}
						className='flex my-5 mb-3 mx-3 p-2 gap-2 items-center bg-white shadow-lg rounded-lg'
						onClick={() => props.closeToggle(false)}
					>
						<img
							src={props.user.image}
							alt={props.user.userName}
							className='w-10 h-10 object-cover rounded-full'
						/>
						<span>{props.user.userName}</span>
					</Link>
				</div>
			)}
		</div>
	);
}

export default Sidebar;
