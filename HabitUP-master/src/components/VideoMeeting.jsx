import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VideoMeeting = ({ userType = 'user', subscriptionType = 'free' }) => {
  const [meetingId, setMeetingId] = useState('')
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [meetingEnded, setMeetingEnded] = useState(false)
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Dr. Sashi Bhusan Nayak', role: 'Mentor', muted: false },
    { id: 2, name: 'You', role: 'Participant', muted: false }
  ])
  const [isEligible, setIsEligible] = useState(true)
  const [loading, setLoading] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  useEffect(() => {
    // Check user eligibility for free users
    if (subscriptionType === 'free') {
      checkUserEligibility()
    }
  }, [subscriptionType])

  const checkUserEligibility = async () => {
    try {
      // Simulate API call to check if user is within 30 days
      const userId = localStorage.getItem('userId') || '1'
      console.log(`Checking eligibility for user: ${userId}`)
      
      // For demo purposes, assume user is eligible
      setIsEligible(true)
    } catch (error) {
      console.error('Error checking eligibility:', error)
      setIsEligible(false)
    }
  }

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      alert('Please enter a meeting ID')
      return
    }

    setLoading(true)
    try {
      // Simulate joining meeting
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Joining meeting:', meetingId)
      setIsInMeeting(true)
      
      // Simulate getting user media
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          })
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        } catch (error) {
          console.log('Camera/microphone access denied:', error)
        }
      }
    } catch (error) {
      console.error('Error joining meeting:', error)
      alert('Failed to join meeting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveMeeting = () => {
    setIsInMeeting(false)
    setMeetingId('')
    setMeetingEnded(false)
    
    // Stop video stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      localVideoRef.current.srcObject = null
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    console.log('Toggled mute:', !isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    console.log('Toggled video:', !isVideoOn)
  }

  const renderMeetingForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-video text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {userType === 'doctor' ? 'Start a Coaching Session' : 
             subscriptionType === 'premium' ? 'Join Your Coaching Session' : 
             'Join Your Free Coaching Session'}
          </h2>
          <p className="text-gray-600">
            {userType === 'doctor' ? 
             'Host live sessions with your clients through our video meeting platform' :
             subscriptionType === 'premium' ? 
             'Connect with your coach through our premium video meeting platform' :
             'Connect with your coach through our video meeting platform (30-day free trial)'}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="meetingId" className="block text-sm font-medium text-gray-700 mb-2">
              Meeting ID
            </label>
            <input
              type="text"
              id="meetingId"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder={userType === 'doctor' ? 
                          'Enter meeting ID to start session' : 
                          'Enter meeting ID provided by your coach'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleJoinMeeting}
            disabled={loading || !meetingId.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                {userType === 'doctor' ? 'Starting Session...' : 'Joining Meeting...'}
              </>
            ) : (
              <>
                <i className="fas fa-video mr-2"></i>
                {userType === 'doctor' ? 'Start Session' : 'Join Meeting'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderMeetingRoom = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Meeting Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Meeting ID: {meetingId}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <i className="fas fa-users"></i>
            <span>{participants.length} participants</span>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black aspect-video">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            poster="/img/MentorMouth.jpg"
          />
          
          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {!isVideoOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <i className="fas fa-user text-white text-2xl"></i>
              </div>
            )}
          </div>

          {/* Meeting Ended Overlay */}
          <AnimatePresence>
            {meetingEnded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
              >
                <div className="text-center text-white">
                  <i className="fas fa-video-slash text-4xl mb-4"></i>
                  <h3 className="text-2xl font-bold mb-2">Meeting Ended</h3>
                  <p className="text-gray-300">The host has ended this meeting</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Meeting Controls */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
            </button>

            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                !isVideoOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              <i className={`fas ${isVideoOn ? 'fa-video' : 'fa-video-slash'}`}></i>
            </button>

            <button
              onClick={handleLeaveMeeting}
              className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Leave meeting"
            >
              <i className="fas fa-phone-slash"></i>
            </button>
          </div>

          {/* Participants List */}
          <div className="mt-6">
            <h5 className="font-medium text-gray-800 mb-3">Participants</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{participant.name}</div>
                    <div className="text-sm text-gray-500">{participant.role}</div>
                  </div>
                  {participant.muted && (
                    <i className="fas fa-microphone-slash text-red-500"></i>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderUpgradePrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-crown text-yellow-600 text-2xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Upgrade to Premium for Coaching Sessions</h3>
        <p className="text-gray-600 mb-6">
          Your free trial period has ended. To continue accessing live coaching sessions, 
          please upgrade to our premium subscription.
        </p>
        <button
          onClick={() => window.location.href = '/subscription'}
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          Upgrade Now
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {subscriptionType === 'free' && !isEligible ? (
          renderUpgradePrompt()
        ) : isInMeeting ? (
          renderMeetingRoom()
        ) : (
          renderMeetingForm()
        )}
      </div>
    </div>
  )
}

export default VideoMeeting