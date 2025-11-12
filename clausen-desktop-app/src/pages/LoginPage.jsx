import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEMO_CREDENTIALS = {
  admin: 'admin123',
  bursar: 'bursar123',
  nurse: 'nurse123',
  dos: 'dos123',
  teacher: 'teacher123'
}

export default function LoginPage() {
  const [role, setRole] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!role || !username || !password) {
      setError('Please fill in all fields')
      return
    }

    if (DEMO_CREDENTIALS[username] === password) {
      // Store user data
      localStorage.setItem('userRole', role)
      localStorage.setItem('username', username)
      
      // Notify Electron
      if (window.electronAPI) {
        window.electronAPI.userLoggedIn(role)
      }
      
      // Navigate to dashboard
      navigate('/')
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="/LOGO WITH NO BACKGROUND.png" 
            alt="Clausen Logo" 
            className="w-32 h-32 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
            Clausen
          </h1>
          <p className="text-dark-200">School Management System</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-dark-200 text-sm font-semibold mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field w-full"
                required
              >
                <option value="">Select your role</option>
                <option value="Administrator">Administrator</option>
                <option value="Bursar">Bursar</option>
                <option value="Nurse">Nurse</option>
                <option value="DOS">Dean of Students</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>

            <div>
              <label className="block text-dark-200 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-dark-200 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-800 rounded-lg border border-dark-600">
            <p className="text-dark-300 text-xs font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-dark-400">
              <p><span className="text-primary">admin</span> / admin123</p>
              <p><span className="text-primary">bursar</span> / bursar123</p>
              <p><span className="text-primary">nurse</span> / nurse123</p>
              <p><span className="text-primary">dos</span> / dos123</p>
              <p><span className="text-primary">teacher</span> / teacher123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
