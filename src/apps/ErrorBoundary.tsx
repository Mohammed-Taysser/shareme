import { Component, ErrorInfo } from 'react';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div className='container m-5'>
					<h2 className='text-3xl' >Something went wrong 🙂.</h2>

					<button
						className='my-3 bg-red-500 text-white py-2 px-3 rounded-full opacity-75 hover:opacity-100 transition-all ease-in-out'
						onClick={() => window.location.reload()}
					>
						Reload
					</button>

					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo?.componentStack}
					</details>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
