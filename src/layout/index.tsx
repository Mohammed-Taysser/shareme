import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { client, userQuery } from '../apps/api';
import MobileNavbar from './MobileNavbar';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import getUserInfo from '../apps/getUserInfo';

function Layout() {
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [query, setQuery] = useState('');

	const userInfo = getUserInfo();

	useEffect(() => {
		client
			.fetch(userQuery(userInfo?._id))
			.then((data) => {
				setUser(data[0]);
			})
			.catch((error) => {
				console.log(error);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
			<div className='hidden md:flex h-screen flex-initial'>
				<Sidebar user={user} closeToggle={setToggleSidebar} />
			</div>
			<MobileNavbar
				user={user}
				toggleSidebar={toggleSidebar}
				setToggleSidebar={setToggleSidebar}
			/>
			<div className='px-3 w-full flex-1 overflow-y-scroll h-screen'>
				<Navbar user={user} setQuery={setQuery} query={query} />
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
