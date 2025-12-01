import { useState, useEffect } from 'react'

export default function Students() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dbConnected, setDbConnected] = useState(false)
  const [scannerConnected, setScannerConnected] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [showFingerprintModal, setShowFingerprintModal] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    gender: 'Male',
    class: '',
    section: '',
    admission_date: new Date().toISOString().split('T')[0],
    blood_group: '',
    email: '',
    phone: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    emergency_contact: '',
    medical_conditions: '',
    status: 'Active'
  })

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection()
    loadStudents()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const result = await window.electronAPI.database.checkConnection()
      setDbConnected(result.connected)
      if (!result.connected) {
        alert('Database not connected. Make sure XAMPP MySQL is running.')
      }
    } catch (error) {
      console.error('Error checking database:', error)
      setDbConnected(false)
    }
  }

  const loadStudents = async () => {
    setLoading(true)
    try {
      const result = await window.electronAPI.database.getStudents({
        search: searchTerm
      })
      
      if (result.success) {
        setStudents(result.data)
      } else {
        console.error('Error loading students:', result.message)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateStudentId = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `STU${year}${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!dbConnected) {
      alert('Database not connected!')
      return
    }

    setLoading(true)
    
    try {
      // Generate student ID if not provided
      const studentData = {
        ...formData,
        student_id: formData.student_id || generateStudentId()
      }

      const result = await window.electronAPI.database.addStudent(studentData)
      
      if (result.success) {
        alert('Student added successfully!')
        setShowAddModal(false)
        resetForm()
        loadStudents()
      } else {
        alert(`Error adding student: ${result.message}`)
      }
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Error adding student. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      date_of_birth: '',
      gender: 'Male',
      class: '',
      section: '',
      admission_date: new Date().toISOString().split('T')[0],
      blood_group: '',
      email: '',
      phone: '',
      address: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      emergency_contact: '',
      medical_conditions: '',
      status: 'Active'
    })
  }

  const filteredStudents = students.filter(student =>
    (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fingerprint functions
  const checkScanner = async () => {
    try {
      const status = await window.electronAPI.fingerprint.getStatus()
      setScannerConnected(status.connected)
      return status.connected
    } catch (error) {
      console.error('Error checking scanner:', error)
      return false
    }
  }

  const connectScanner = async () => {
    try {
      const devices = await window.electronAPI.fingerprint.listDevices()
      if (devices.success && devices.devices.length > 0) {
        const result = await window.electronAPI.fingerprint.connect(devices.devices[0].path)
        if (result.success) {
          setScannerConnected(true)
          alert('Fingerprint scanner connected successfully!')
          return true
        }
      } else {
        alert('No fingerprint scanner found. Please connect a fingerprint scanner device.')
      }
    } catch (error) {
      console.error('Error connecting scanner:', error)
      alert('Failed to connect fingerprint scanner: ' + error.message)
    }
    return false
  }

  const enrollFingerprint = async (student) => {
    setCurrentStudent(student)
    setShowFingerprintModal(true)
    
    // Check if scanner is connected
    const isConnected = await checkScanner()
    if (!isConnected) {
      const connected = await connectScanner()
      if (!connected) {
        setShowFingerprintModal(false)
        return
      }
    }
  }

  const scanFingerprint = async () => {
    if (!currentStudent) return
    
    setScanning(true)
    try {
      const result = await window.electronAPI.fingerprint.scan()
      
      if (result.success) {
        // Save fingerprint to database
        const saveResult = await window.electronAPI.database.updateFingerprint(
          currentStudent.student_id,
          result.data.template
        )
        
        if (saveResult.success) {
          alert(`Fingerprint enrolled successfully!\nQuality: ${result.data.quality}%`)
          setShowFingerprintModal(false)
          loadStudents()
        } else {
          alert('Failed to save fingerprint: ' + saveResult.message)
        }
      } else {
        alert('Failed to scan fingerprint: ' + result.error)
      }
    } catch (error) {
      console.error('Error scanning fingerprint:', error)
      alert('Error scanning fingerprint: ' + error.message)
    } finally {
      setScanning(false)
    }
  }

  const removeFingerprint = async (studentId) => {
    if (!confirm('Are you sure you want to remove this student\'s fingerprint?')) {
      return
    }
    
    try {
      const result = await window.electronAPI.database.removeFingerprint(studentId)
      if (result.success) {
        alert('Fingerprint removed successfully!')
        loadStudents()
      } else {
        alert('Failed to remove fingerprint: ' + result.message)
      }
    } catch (error) {
      console.error('Error removing fingerprint:', error)
      alert('Error removing fingerprint')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Students Management</h1>
          <p className="text-dark-300">View and manage all students</p>
          {!dbConnected && (
            <p className="text-red-500 text-sm mt-2">⚠️ Database not connected. Start XAMPP MySQL.</p>
          )}
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
          disabled={!dbConnected}
        >
          + Add New Student
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students by name or ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            loadStudents()
          }}
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
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Parent</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Contact</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Fingerprint</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Status</th>
              <th className="text-left px-6 py-4 text-primary text-xs font-semibold uppercase tracking-wider border-b border-dark-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-dark-300">Loading students...</td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-dark-300">No students found</td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-primary/5 transition-colors border-b border-dark-600 last:border-b-0">
                  <td className="px-6 py-4 text-dark-100 text-sm">{student.student_id}</td>
                  <td className="px-6 py-4 text-dark-100 text-sm">{student.first_name} {student.last_name}</td>
                  <td className="px-6 py-4 text-dark-100 text-sm">{student.class}</td>
                  <td className="px-6 py-4 text-dark-100 text-sm">{student.parent_name}</td>
                  <td className="px-6 py-4 text-dark-100 text-sm">{student.parent_phone}</td>
                  <td className="px-6 py-4">
                    {student.fingerprint_enrolled ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-xs">✓ Enrolled</span>
                        <button 
                          onClick={() => removeFingerprint(student.student_id)}
                          className="text-red-500 hover:text-red-400 text-xs"
                          title="Remove fingerprint"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => enrollFingerprint(student)}
                        className="text-primary hover:text-primary/80 text-xs"
                        disabled={!dbConnected}
                      >
                        + Enroll
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="btn-icon" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="btn-icon" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 border border-dark-600 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-600 flex items-center justify-between sticky top-0 bg-dark-800">
              <h2 className="text-2xl font-bold text-white">Add New Student</h2>
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="btn-icon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-primary mb-4">Student Information</h3>
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Student ID (Auto-generated if empty)</label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    placeholder="Leave empty for auto-generation"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Class *</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    placeholder="e.g., Grade 10"
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g., A"
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Admission Date *</label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Blood Group</label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+256 700 000000"
                    className="input-field w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-dark-200 text-sm mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="input-field w-full"
                  ></textarea>
                </div>

                {/* Parent Information */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-primary mb-4">Parent/Guardian Information</h3>
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Parent Phone *</label>
                  <input
                    type="tel"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleInputChange}
                    placeholder="+256 700 000000"
                    required
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Parent Email</label>
                  <input
                    type="email"
                    name="parent_email"
                    value={formData.parent_email}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-dark-200 text-sm mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    placeholder="+256 700 000000"
                    className="input-field w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-dark-200 text-sm mb-2">Medical Conditions</label>
                  <textarea
                    name="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Any allergies or medical conditions..."
                    className="input-field w-full"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Adding Student...' : 'Add Student'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fingerprint Scan Modal */}
      {showFingerprintModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-primary/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Enroll Fingerprint
            </h2>
            
            {currentStudent && (
              <div className="mb-6 text-center">
                <p className="text-dark-300 mb-2">Student:</p>
                <p className="text-xl font-semibold text-primary">
                  {currentStudent.first_name} {currentStudent.last_name}
                </p>
                <p className="text-sm text-dark-400">{currentStudent.student_id}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="flex flex-col items-center justify-center p-8 bg-dark-700 rounded-xl border-2 border-dashed border-primary/30">
                {scanning ? (
                  <>
                    <div className="w-24 h-24 mb-4 relative">
                      <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-primary font-semibold mb-2">Scanning...</p>
                    <p className="text-dark-400 text-sm">Place finger on scanner</p>
                  </>
                ) : (
                  <>
                    <svg className="w-20 h-20 text-primary/60 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"/>
                    </svg>
                    <p className="text-dark-300 font-semibold mb-2">Ready to Scan</p>
                    <p className="text-dark-400 text-sm">Click button below to start</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={scanFingerprint}
                disabled={scanning}
                className="btn-primary flex-1"
              >
                {scanning ? 'Scanning...' : 'Start Scan'}
              </button>
              <button
                onClick={() => {
                  setShowFingerprintModal(false)
                  setCurrentStudent(null)
                  setScanning(false)
                }}
                disabled={scanning}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>

            {!scannerConnected && (
              <p className="text-yellow-500 text-xs text-center mt-4">
                ⚠️ Scanner not detected. Connect a fingerprint scanner to continue.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
