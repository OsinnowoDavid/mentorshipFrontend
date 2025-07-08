
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function Unauthorized() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access this page. 
          {user && (
            <span className="block mt-2">
              You are logged in as: <span className="font-semibold text-gray-800">{user.email}</span>
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Go to Home
          </Link>
          
          <Link
            to="/profile"
            className="block w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            View Profile
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-6">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}

export default Unauthorized 