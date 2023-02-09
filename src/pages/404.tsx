import PageNotFoundImage from '../assets/images/icons/404.svg';

function PageNotFound() {
	return (
		<div className='text-center'>
			<img
				src={PageNotFoundImage}
				className='inline-block'
				alt='Page Not Found'
			/>
			<p className='mt-7 font-bold text-1xl'>
				opp's the page you'e looking for is not exist!
			</p>
		</div>
	);
}

export default PageNotFound;
