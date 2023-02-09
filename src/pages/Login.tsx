import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { client } from '../apps/api';
import whiteLogo from '../assets/images/icons/logo-white.png';
import shareVideo from '../assets/videos/share.mp4';

interface DecodedCredentialResponse {
	name: string;
	picture: string;
}

function Login() {
	const navigateTo = useNavigate();

	const onSuccess = (credentialResponse: CredentialResponse) => {
		try {
			const decoded: DecodedCredentialResponse = jwt_decode(
				credentialResponse.credential || ''
			);

			const doc = {
				_id: credentialResponse.clientId || '',
				_type: 'user',
				image: decoded.picture,
				userName: decoded.name,
			};

			localStorage.setItem('shareme-user', JSON.stringify(doc));

			client.createIfNotExists(doc).then((res) => {
				navigateTo('/', { replace: true });
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className='relative h-full w-full'>
				<video
					src={shareVideo}
					autoPlay
					loop
					controls={false}
					muted
					className='h-full w-full object-cover'
				/>
				<div className='flex absolute flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
					<div className='p-5 text-center'>
						<img
							src={whiteLogo}
							alt='white logo'
							width={130}
							className='mx-auto'
						/>
						<div className='shadow-2xl mt-4'>
							<GoogleLogin
								onSuccess={onSuccess}
								onError={() => {
									console.log('Login Failed');
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
