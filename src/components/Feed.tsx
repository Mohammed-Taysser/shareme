import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Masonry from './Masonry';
import Spinner from './Spinner';
import { client, feedQuery, searchQuery } from '../apps/api';

function Feed() {
	const { categoryId } = useParams();
	const [loading, setLoading] = useState(true);
	const [pins, setPins] = useState<Pin[]>([]);

	useEffect(() => {
		let query = null;

		if (categoryId) {
			query = searchQuery(categoryId);
		} else {
			query = feedQuery;
		}

		client
			.fetch(query)
			.then((data) => {
				setLoading(false);
				setPins(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [categoryId]);

	if (loading) {
		return <Spinner msg='We are adding new ideas to your feed!' />;
	}

	return (
		<div>
			<Masonry pins={pins} />
		</div>
	);
}

export default Feed;
