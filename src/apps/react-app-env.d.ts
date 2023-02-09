/// <reference types="react-scripts" />

declare module '*.mp4' {
	const src: string;
	export default src;
}

interface User {
	_createdAt: Date;
	_id: string;
	_rev: string;
	_type: string;
	_updatedAt: Date;
	image: string;
	userName: string;
}

interface Save {
	_key: string,
	postedBy: {
		_id: string,
		userName: string,
		image: string
	},
}

interface Comment {
	postedBy: {
		_id: string,
		userName: string,
		image: string
	},
	comment: string
}

interface Pin {
	_id: string
	destination: string
	title: string
	image: string
	category: string
	about: string
	postedBy: {
		_id: string
		image: string,
		userName: string
	}
	_id: string
	image: string
	userName: string
	save?: Save[],
	comments: Comment[]
}

interface SidebarProps {
	user: User | null;
	closeToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NavbarProps {
	user: User | null;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	query: string
}

interface MobileNavbarProps {
	user: User | null;
	setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
	toggleSidebar: boolean
}

interface SpinnerProps {
	msg?: string;
}

interface MasonryProps {
	pins: Pin[]
}
