import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MeetingManagement = ({ userType = 'user' }) => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    participants: '',
    description: ''
  })

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Habit Formation Consultation',
      date: '2024-02-15',
      time: '10:00 AM',
      duration: '60 minutes',
      participants: ['Dr. Sashi Bhusan Nayak', 'John Doe'],
      status: 'confirmed',
      meetingId: 'HBT-001-2024',
      type: 'video'
    },
    {
      id: 2,
      title: 'Weekly Progress Review',
      date: '2024-02-18',
      time: '2:00 PM',
      duration: '45 minutes',
      participants: ['Dr. Sashi Bhusan Nayak', 'Jane Smith'],
      status: 'pending',
      meetingId: 'HBT-002-2024',
      type: 'video'
    },
    {
      id: 3,
      title: 'Goal Setting Session',
      date: '2024-02-20',
      time: '11:30 AM',
      duration: '90 minutes',
      participants: ['Dr. Sashi Bhusan Nayak', 'Mike Johnson'],
      status: 'confirmed',
      meetingId: 'HBT-003-2024',
      type: 'video'
    }
  ]

  const pastMeetings = [
    {
      id: 4,
      title: 'Initial Assessment',
      date: '2024-02-10',
      time: '3:00 PM',
      duration: '60 minutes',
      participants: ['Dr. Sashi Bhusan Nayak', 'John Doe'],
      status: 'completed',
      meetingId: 'HBT-004-2024',
      type: 'video',
      recording: true
    },
    {
      id: 5,
      title: 'Habit Strategy Planning',
      date: '2024-02-08',
      time: '1:00 PM',
      duration: '75 minutes',
      participants: ['Dr. Sashi Bhusan Nayak', 'Sarah Wilson'],
      status: 'completed',
      meetingId: 'HBT-005-2024',
      type: 'video',
      recording: true
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleScheduleMeeting = () => {
    console.log('Scheduling meeting:', newMeeting)
    setShowScheduleModal(false)
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '60',
      participants: '',
      description: ''
    })
    alert('Meeting scheduled successfully!')
  }

  const handleJoinMeeting = (meeting) => {
    console.log('Joining meeting:', meeting.meetingId)
    alert(`Joining meeting: ${meeting.title}\nMeeting ID: ${meeting.meetingId}`)
  }

  const handleCancelMeeting = (meetingId) => {
    if (confirm('Are you sure you want to cancel this meeting?')) {
      console.log('Cancelling meeting:', meetingId)
      alert('Meeting cancelled successfully!')
    }
  }

  const handleRescheduleMeeting = (meetingId) => {
    console.log('Rescheduling meeting:', meetingId)
    alert('Reschedule functionality would open a date/time picker')
  }

  const handleViewRecording = (meetingId) => {
    console.log('Viewing recording for meeting:', meetingId)
    alert('Recording viewer would open here')
  }

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingMeetings.length },
    { id: 'past', label: 'Past Meetings', count: pastMeetings.length }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Management</h1>
          <p className="text-gray-600 mt-2">
            {userType === 'doctor' ? 
             'Manage your coaching sessions and client meetings' : 
             'View and manage your scheduled coaching sessions'}
          </p>
        </div>
        {userType === 'doctor' && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Schedule Meeting
          </button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Meetings</h3>
              <div className="text-2xl font-bold text-gray-900">
                {upcomingMeetings.length + pastMeetings.length}
              </div>
            </div>
            <i className="fas fa-calendar text-blue-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
              <div className="text-2xl font-bold text-gray-900">{upcomingMeetings.length}</div>
            </div>
            <i className="fas fa-clock text-green-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <div className="text-2xl font-bold text-gray-900">{pastMeetings.length}</div>
            </div>
            <i className="fas fa-check-circle text-purple-500 text-2xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">This Week</h3>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
            <i className="fas fa-calendar-week text-yellow-500 text-2xl"></i>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2 text-purple-500"></i>
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-2 text-purple-500"></i>
                          {meeting.time}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-hourglass-half mr-2 text-purple-500"></i>
                          {meeting.duration}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-video mr-2 text-purple-500"></i>
                          {meeting.meetingId}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        <i className="fas fa-users text-gray-400"></i>
                        <span className="text-sm text-gray-600">
                          Participants: {meeting.participants.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleJoinMeeting(meeting)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <i className="fas fa-video mr-2"></i>
                        Join
                      </button>
                      {userType === 'doctor' && (
                        <>
                          <button
                            onClick={() => handleRescheduleMeeting(meeting.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <i className="fas fa-edit mr-2"></i>
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelMeeting(meeting.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        {meeting.recording && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            <i className="fas fa-video mr-1"></i>
                            Recorded
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2 text-gray-400"></i>
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-2 text-gray-400"></i>
                          {meeting.time}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-hourglass-half mr-2 text-gray-400"></i>
                          {meeting.duration}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-video mr-2 text-gray-400"></i>
                          {meeting.meetingId}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <i className="fas fa-users text-gray-400"></i>
                        <span className="text-sm text-gray-600">
                          Participants: {meeting.participants.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {meeting.recording && (
                        <button
                          onClick={() => handleViewRecording(meeting.id)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                        >
                          <i className="fas fa-play mr-2"></i>
                          View Recording
                        </button>
                      )}
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                        <i className="fas fa-download mr-2"></i>
                        Summary
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Schedule Meeting Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Schedule New Meeting</h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter meeting title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participants (emails)</label>
                  <input
                    type="text"
                    value={newMeeting.participants}
                    onChange={(e) => setNewMeeting({ ...newMeeting, participants: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter participant emails separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Meeting description or agenda"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Schedule Meeting
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MeetingManagement