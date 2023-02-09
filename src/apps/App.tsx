import React, {useEffect} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'
import ErrorBoundary from './ErrorBoundary'
import MainRoute from './routes'

function App() {
	useEffect(() => {
		// remove loading after content load
		window.onload = function () {
			document.body.classList.remove('load')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<ErrorBoundary>
			<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
				<BrowserRouter>
					<MainRoute />
				</BrowserRouter>
			</GoogleOAuthProvider>
		</ErrorBoundary>
	)
}

export default App
