import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatSystem = ({ userType = 'user', recipientName = 'Dr. Sashi Bhusan Nayak' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'instructor',
      message: 'Hello! I\'m here to help you with your habit formation journey. What specific challenge would you like to work on today?',
      time: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 300000
    },
    {
      id: 2,
      type: 'user',
      message: 'Hi! I\'ve been trying to wake up at 6am for months but I keep hitting snooze. I go to bed around 11:30pm but can\'t seem to fall asleep quickly.',
      time: new Date(Date.now() - 240000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 240000
    },
    {
      id: 3,
      type: 'instructor',
      message: 'I understand the struggle. Let\'s analyze your current routine. What time do you usually go to bed, and what do you typically do in the hour before bedtime?',
      time: new Date(Date.now() - 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 180000
    },
    {
      id: 4,
      type: 'user',
      message: 'Usually around 11:30pm, but I often scroll through my phone until midnight or later. I know it\'s bad but I can\'t seem to stop.',
      time: new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 120000
    },
    {
      id: 5,
      type: 'instructor',
      message: 'This makes perfect sense. For a 6am wake-up, you need 7-8 hours of sleep. Let\'s create a gradual wind-down routine starting at 10pm. Here\'s what I suggest:\n\n1. 10:00 PM - Put phone in another room\n2. 10:15 PM - Light stretching or reading\n3. 10:45 PM - Lights out\n\nWould you like to try this for a week?',
      time: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now() - 60000
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: userType === 'doctor' ? 'instructor' : 'user',
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate instructor typing and response
    if (userType !== 'doctor') {
      setIsTyping(true)
      setTimeout(() => {
        const responses = [
          'That sounds like a great plan! How do you feel about starting with just one small change?',
          'I can see you\'re really committed to making this work. Let\'s break this down into smaller steps.',
          'Excellent question! Here\'s what I\'d recommend based on my experience with similar cases...',
          'That\'s a common challenge. Let me share a technique that has worked well for many of my clients.',
          'I appreciate you sharing that with me. Let\'s work together to find a solution that fits your lifestyle.'
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        const instructorMessage = {
          id: Date.now() + 1,
          type: 'instructor',
          message: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: Date.now()
        }
        
        setMessages(prev => [...prev, instructorMessage])
        setIsTyping(false)
      }, 2000 + Math.random() * 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-sm"></i>
            </div>
            <div>
              <h3 className="font-semibold">
                {userType === 'doctor' ? 'Client Chat' : recipientName}
              </h3>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
              <i className="fas fa-phone text-sm"></i>
            </button>
            <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors">
              <i className="fas fa-video text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{formatMessage(message.message)}</p>
                <span className={`text-xs block mt-1 ${
                  message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '100px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i className="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fas fa-paperclip text-sm"></i>
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fas fa-smile text-sm"></i>
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSystem