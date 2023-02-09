import React from 'react';

export const Homepage = React.lazy(() => import('../pages/Homepage'));
export const PageNotFound = React.lazy(() => import('../pages/404'));
export const Profile = React.lazy(() => import('../pages/Profile'));
export const PinDetails = React.lazy(() => import('../pages/pin/Single.pin'));
export const CreatePin = React.lazy(() => import('../pages/pin/Create.pin'));
export const Login = React.lazy(() => import('../pages/Login'));
export const Category = React.lazy(() => import('../pages/Category'));
export const Search = React.lazy(() => import('../pages/Search'));

export const PUBLIC_ROUTES = [
	{
		path: '/',
		component: Homepage,
	},
	{
		path: '*',
		component: PageNotFound,
	},
	{
		path: '/profile/:userId',
		component: Profile,
	},
	{
		path: '/pins/create',
		component: CreatePin,
	},
	{
		path: '/pins/:pinId',
		component: PinDetails,
	},
	{
		path: '/category/:categoryId',
		component: Category,
	},
	{
		path: '/search',
		component: Search,
	},
];
