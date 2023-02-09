import React from 'react';
import { Circles } from 'react-loader-spinner';

function Spinner(props: SpinnerProps) {
	return (
		<div className='flex flex-col w-full h-full justify-center items-center'>
			<Circles
				color='#00BFFF'
				width={50}
				height={50}
				wrapperClass='m-5'
				ariaLabel='circles-loading'
			/>
			<p className='text-lg text-center p-2'>{props.msg}</p>
		</div>
	);
}

export default Spinner;
