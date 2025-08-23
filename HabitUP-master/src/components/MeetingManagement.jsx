                  {meeting.status === 'COMPLETED' && (
                    <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import meetingService from '../services/meetingService'
import paymentService from '../services/paymentService'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  const [activeTab, setActiveTab] = useState('upcoming')
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-4">Schedule Meeting</h2>
              <form onSubmit={handleScheduleMeeting} className="space-y-4">
    loadMeetings()
                  <label className="block text-gray-700 mb-2">Title</label>

  const loadMeetings = async () => {
    try {
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, title: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required

      switch (activeTab) {
                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, date: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, time: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
  }
  const handleScheduleMeeting = async (e) => {
                  <label className="block text-gray-700 mb-2">Duration (minutes)</label>
    try {
      setLoading(true)
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, duration: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
      const meeting = await meetingService.scheduleMeeting({
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
      // Handle payment if required
      if (meeting.payment) {
        window.location.href = paymentSession.url
                  <label className="block text-gray-700 mb-2">Type</label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, type: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="VIDEO">Video Call</option>
                    <option value="CHAT">Chat</option>
                  </select>
      setLoading(false)
  }
                  <label className="block text-gray-700 mb-2">Description</label>
  const handleJoinMeeting = async (meetingId) => {
    try {
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2"
    } catch (err) {
    }
  }
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                  >
                    {loading ? 'Scheduling...' : 'Schedule'}
                  </button>
                </div>
              </form>
            </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['upcoming', 'past', 'pending'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Meetings
          </button>
        ))}
      </div>

      {/* Schedule Meeting Button */}
      <button
        onClick={() => setShowScheduleModal(true)}
        className="mb-6 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
      >
        Schedule New Meeting
      </button>

      {/* Meetings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {meetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{meeting.title}</h3>
                  <p className="text-gray-600">
                    {new Date(meeting.scheduledDate).toLocaleDateString()} at{' '}
                    {meeting.scheduledTime}
                  </p>
                  <p className="text-gray-600">Duration: {meeting.duration} minutes</p>
                  <p className="text-gray-600">Type: {meeting.type}</p>
                  {meeting.description && (
                    <p className="text-gray-600 mt-2">{meeting.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {meeting.status === 'SCHEDULED' && new Date(meeting.scheduledDate) > new Date() && (
                    <>
                      <button
                        onClick={() => handleJoinMeeting(meeting.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => handleCancelMeeting(meeting.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}

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

export default MeetingManagement;