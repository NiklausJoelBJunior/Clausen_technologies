import { useState } from 'react'

const sampleStudents = [
  { id: 'STU001', name: 'John Doe', class: 'Grade 10', dob: '2010-05-15', guardian: 'Mary Doe', contact: '+256 700 123456', status: 'active' },
  { id: 'STU002', name: 'Jane Smith', class: 'Grade 9', dob: '2011-03-20', guardian: 'Bob Smith', contact: '+256 700 234567', status: 'active' },
  { id: 'STU003', name: 'Michael Johnson', class: 'Grade 10', dob: '2010-08-12', guardian: 'Lisa Johnson', contact: '+256 700 345678', status: 'active' },
]

export default function Students() {
  const [students, setStudents] = useState(sampleStudents)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Students Management</h1>
          <p className="text-dark-300">View and manage all students</p>
        </div>
        <button className="btn-primary">+ Add New Student</button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full max-w-md"
        />
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary/5">
            <tr>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Student ID</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Name</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Class</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Guardian</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Contact</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Status</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={student.id} className="hover:bg-primary/5 transition-colors border-b border-dark-600 last:border-b-0">
                <td className="px-6 py-4 text-dark-100 text-sm">{student.id}</td>
                <td className="px-6 py-4 text-dark-100 text-sm">{student.name}</td>
                <td className="px-6 py-4 text-dark-100 text-sm">{student.class}</td>
                <td className="px-6 py-4 text-dark-100 text-sm">{student.guardian}</td>
                <td className="px-6 py-4 text-dark-100 text-sm">{student.contact}</td>
                <td className="px-6 py-4">
                  <span className={`status-badge ${student.status}`}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
