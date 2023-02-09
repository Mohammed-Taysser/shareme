import { AiFillCloseCircle } from 'react-icons/ai';
import { HiMenu } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import logo from '../assets/images/icons/logo.png';
import Sidebar from './Sidebar';

function MobileNavbar(props: MobileNavbarProps) {
	return (
		<div className='flex md:hidden flex-row'>
			<div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
				<HiMenu
					className='cursor-pointer text-4xl'
					onClick={() => props.setToggleSidebar(true)}
				/>
				<Link to='/'>
					<img src={logo} alt='logo' className='w-28' />
				</Link>
				{props.user && (
					<Link to={`/profile/${props.user._id}`}>
						<img
							src={props.user.image}
							alt='logo'
							className='w-14 rounded-full object-cover'
						/>
					</Link>
				)}
			</div>

			{props.toggleSidebar && (
				<div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
					<div className='absolute w-full flex justify-end items-center p-2'>
						<AiFillCloseCircle
							className='cursor-pointer text-3xl'
							onClick={() => props.setToggleSidebar(false)}
						/>
					</div>
					<Sidebar user={props.user} closeToggle={props.setToggleSidebar} />
				</div>
			)}
		</div>
	);
}

export default MobileNavbar;
