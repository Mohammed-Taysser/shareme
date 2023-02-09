import clientSanity from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const client = clientSanity({
	projectId: process.env.REACT_APP_SANITY_PROJECT_ID || '',
	dataset: 'production',
	apiVersion: '2023-02-06',
	useCdn: true,
	token: process.env.REACT_APP_SANITY_TOKEN || '',
});

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

function userQuery(userId: string): string {
	return `*[_type == 'user' && _id == '${userId}' ]`;
}

function searchQuery(query: string): string {
	return `*[_type == 'pin' && title match '${query}*' || category match '${query}*' || about match '${query}*' ]{
		_id,
		title,
		destination,
		postedBy -> {
			_id,
			userName,
			image
		},
		image {
			asset -> {
				url
			},
		},
		save[]{
			_key,
			postedBy -> {
				_id,
				userName,
				image
			},
		},
	}`;
}

const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
	_id,
	title,
	destination,
	postedBy -> {
		_id,
		userName,
		image
	},
	image {
		asset -> {
			url
		},
	},
	save[]{
		_key,
		postedBy -> {
			_id,
			userName,
			image
		},
	},
}`;

const pinDetailQuery = (pinId: string) => {
	return `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
};

const pinDetailMorePinQuery = (pin: Pin) => {
	return `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
};

const userCreatedPinsQuery = (userId: string) => {
	return `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
};

const userSavedPinsQuery = (userId: string) => {
	return `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
};

export {
	client,
	urlFor,
	userQuery,
	searchQuery,
	feedQuery,
	pinDetailQuery,
	pinDetailMorePinQuery,
	userCreatedPinsQuery,
	userSavedPinsQuery,
};
