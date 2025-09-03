import { useEffect } from 'react'

const AdminTest = () => {
  useEffect(() => {
    console.log('AdminTest component mounted')
    console.log('localStorage admin data:', {
      adminToken: localStorage.getItem('adminToken'),
      adminName: localStorage.getItem('adminName'),
      adminEmail: localStorage.getItem('adminEmail'),
      isDemoAdmin: localStorage.getItem('isDemoAdmin')
    })
  }, [])

  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, the admin routing is working!</p>
        <div className="space-y-2 text-sm">
          <p><strong>Token:</strong> {localStorage.getItem('adminToken') || 'Not found'}</p>
          <p><strong>Name:</strong> {localStorage.getItem('adminName') || 'Not found'}</p>
          <p><strong>Email:</strong> {localStorage.getItem('adminEmail') || 'Not found'}</p>
          <p><strong>Demo Mode:</strong> {localStorage.getItem('isDemoAdmin') || 'false'}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default AdminTest