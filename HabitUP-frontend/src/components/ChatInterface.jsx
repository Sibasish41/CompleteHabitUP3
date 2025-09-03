import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import messageService from '../services/messageService';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const ChatInterface = ({ conversationId, receiverId, receiverType, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
    const cleanup = messageService.subscribeToConversation(
      conversationId,
      handleNewMessage,
      handleTypingIndicator
    );

    return () => {
      cleanup();
      messageService.markConversationAsRead(conversationId);
    };
  }, [conversationId]);

  const loadMessages = async (loadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      const pageToLoad = loadMore ? page + 1 : 1;

      const { messages: newMessages, pagination } = await messageService.getMessages(
        conversationId,
        pageToLoad
      );

      setMessages(prev =>
        loadMore ? [...prev, ...newMessages] : newMessages
      );
      setHasMore(pageToLoad < pagination.totalPages);
      setPage(pageToLoad);

      if (!loadMore) {
        scrollToBottom();
      }
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    scrollToBottom();
  };

  const handleTypingIndicator = (typingUserId) => {
    if (typingUserId !== user.userId) {
      setTyping(true);
      setTimeout(() => setTyping(false), 3000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messageService.sendMessage(
        receiverId,
        receiverType,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    messageService.sendTypingIndicator(conversationId);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between bg-primary-50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-primary-700 font-semibold">
              {receiverName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{receiverName}</h3>
            {typing && (
              <p className="text-sm text-gray-600">Typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && !messages.length ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {hasMore && (
              <button
                onClick={() => loadMessages(true)}
                className="w-full text-primary-600 hover:text-primary-700 text-sm py-2"
              >
                Load more messages
              </button>
            )}
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.senderId === user.userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === user.userId
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.messageContent}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        {error && (
          <div className="mb-2 text-red-500 text-sm">{error}</div>
        )}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
