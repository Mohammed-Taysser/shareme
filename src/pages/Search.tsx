import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { client, feedQuery, searchQuery } from '../apps/api';
import Masonry from '../components/Masonry';
import { useSearchParams } from 'react-router-dom';

function Search() {
	const [searchParams] = useSearchParams();
	const searchTerm = searchParams.get('query');
	const [isLoading, setIsLoading] = useState(true);
	const [pins, setPins] = useState<Pin[]>([]);

	useEffect(() => {
		let query = null;

		if (searchTerm) {
			query = searchQuery(searchTerm.toLowerCase());
		} else {
			query = feedQuery;
		}

		client
			.fetch(query)
			.then((data) => {
				setPins(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [searchTerm]);

	if (isLoading) {
		return <Spinner msg='Search ...' />;
	} else {
		return <Masonry pins={pins} />;
	}
}

export default Search;
