export default function Dashboard() {
  const stats = [
    { label: 'Total Students', value: '1,234', change: '+12% from last month', positive: true },
    { label: 'Total Teachers', value: '87', change: '+3 new', positive: true },
    { label: 'Active Classes', value: '42', change: 'All running', positive: true },
    { label: 'Attendance Rate', value: '94.5%', change: '+2.3% this week', positive: true },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-dark-300">Welcome to Clausen School Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <h3 className="text-dark-300 text-sm font-medium mb-3">{stat.label}</h3>
            <p className="text-white text-3xl font-bold mb-2">{stat.value}</p>
            <span className={`text-sm ${stat.positive ? 'text-primary' : 'text-red-500'}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              New student enrolled: John Doe (Grade 10)
            </li>
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              Attendance marked for Grade 9A
            </li>
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              Report generated: Monthly Performance
            </li>
            <li className="text-dark-300 text-sm">
              New teacher added: Sarah Johnson
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-white text-lg font-semibold mb-4">Upcoming Events</h3>
          <ul className="space-y-3">
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              Parent-Teacher Meeting - Nov 15, 2025
            </li>
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              Mid-term Exams - Nov 20-25, 2025
            </li>
            <li className="pb-3 border-b border-dark-600 text-dark-300 text-sm">
              Sports Day - Dec 1, 2025
            </li>
            <li className="text-dark-300 text-sm">
              Winter Break - Dec 15, 2025
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
