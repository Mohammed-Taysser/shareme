
function getUserInfo() {
	if (localStorage.getItem('shareme-user')) {
		return JSON.parse(localStorage.getItem('shareme-user') || '{}')
	}
	return null
}

export default getUserInfo
