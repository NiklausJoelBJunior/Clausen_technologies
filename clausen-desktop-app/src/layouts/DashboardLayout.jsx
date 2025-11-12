import { Outlet } from 'react-router-dom'
import TitleBar from '../components/TitleBar'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-900">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
