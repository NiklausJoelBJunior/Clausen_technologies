export default function TitleBar() {
  const handleMinimize = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  }

  const handleMaximize = () => {
    if (window.electronAPI) {
      window.electronAPI.maximizeWindow()
    }
  }

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeWindow()
    }
  }

  return (
    <div 
      className="h-10 bg-dark-700 border-b border-dark-600 flex items-center justify-between px-4 select-none"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <span className="text-dark-200 text-sm font-medium">
        Clausen School Management System
      </span>
      
      <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center text-dark-200 hover:bg-dark-600 hover:text-white rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center text-dark-200 hover:bg-dark-600 hover:text-white rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </button>
        
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center text-dark-200 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
