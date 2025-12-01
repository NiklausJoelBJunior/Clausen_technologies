import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoadingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 12000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="w-screen h-screen bg-dark-900 flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/LOGO WITH NO BACKGROUND.png" 
            alt="Clausen Logo" 
            className="w-32 h-32 mx-auto mb-4 animate-pulse"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-1">
            Clausen
          </h1>
          <p className="text-dark-200 text-base">School Management System</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-dark animate-loading-bar"></div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Student Management</h3>
              <p className="text-dark-300 text-xs">Register and manage students</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} points="9 11 12 14 22 4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Attendance Tracking</h3>
              <p className="text-dark-300 text-xs">Track student and staff attendance</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="12" y1="20" x2="12" y2="10" />
                <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="18" y1="20" x2="18" y2="4" />
                <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1="6" y1="20" x2="6" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Reports & Analytics</h3>
              <p className="text-dark-300 text-xs">Generate comprehensive reports</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-loading-bar {
            animation: loading-bar 12s linear forwards;
          }
        `}</style>
      </div>
    </div>
  )
}
