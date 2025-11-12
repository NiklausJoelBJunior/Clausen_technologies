import { useState, useEffect } from 'react'

export default function Settings() {
  const [version, setVersion] = useState('1.1.0')
  const [checking, setChecking] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('')

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getCurrentVersion().then(v => setVersion(v))
    }
  }, [])

  const handleCheckUpdates = async () => {
    if (!window.electronAPI) return
    
    setChecking(true)
    setUpdateStatus('Checking for updates...')
    
    try {
      const result = await window.electronAPI.checkForUpdates()
      if (result.success) {
        setUpdateStatus('✓ App is up to date')
      } else {
        setUpdateStatus(`Error: ${result.error}`)
      }
    } catch (error) {
      setUpdateStatus('Failed to check for updates')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-300">Configure your application</p>
      </div>

      {/* Application Info */}
      <div className="card mb-6">
        <h3 className="text-white text-lg font-semibold mb-4">Application Information</h3>
        <p className="text-dark-300 text-sm mb-4">
          Manage your Clausen School Management System settings and preferences.
        </p>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-dark-600">
            <span className="text-dark-300 text-sm font-medium">Version</span>
            <span className="text-white text-sm">{version}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-dark-600">
            <span className="text-dark-300 text-sm font-medium">Platform</span>
            <span className="text-white text-sm">Windows</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-dark-300 text-sm font-medium">Framework</span>
            <span className="text-white text-sm">Electron + React + Vite</span>
          </div>
        </div>
      </div>

      {/* Updates */}
      <div className="card">
        <h3 className="text-white text-lg font-semibold mb-4">Updates</h3>
        <p className="text-dark-300 text-sm mb-4">
          Keep your application up to date with the latest features and security improvements.
        </p>
        <button
          onClick={handleCheckUpdates}
          disabled={checking}
          className="btn-primary"
        >
          {checking ? 'Checking...' : 'Check for Updates'}
        </button>
        {updateStatus && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            updateStatus.includes('Error') || updateStatus.includes('Failed')
              ? 'bg-red-500/10 border border-red-500/30 text-red-500'
              : 'bg-primary/10 border border-primary/30 text-primary'
          }`}>
            {updateStatus}
          </div>
        )}
      </div>
    </div>
  )
}
