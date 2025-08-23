import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import videoService from '../services/videoService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const VideoConsultation = ({ meetingId, participantName, isDoctor }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    initializeVideoCall();
    return () => {
      videoService.cleanup();
    };
  }, [meetingId]);

  const initializeVideoCall = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize WebRTC connection
      const localStream = await videoService.initializeConnection(
        meetingId,
        user.userId,
        isDoctor
      );

      // Set up local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Handle remote stream
      videoService.onRemoteStream = (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          setConnectionStatus('connected');
        }
      };

      // Create offer if doctor
      if (isDoctor) {
        await videoService.createOffer(meetingId, user.userId);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to initialize video call');
      toast.error('Failed to initialize video call');
      setLoading(false);
    }
  };

  const toggleVideo = async () => {
    try {
      const enabled = await videoService.toggleVideo();
      setIsVideoEnabled(enabled);
    } catch (err) {
      toast.error('Failed to toggle video');
    }
  };

  const toggleAudio = async () => {
    try {
      const enabled = await videoService.toggleAudio();
      setIsAudioEnabled(enabled);
    } catch (err) {
      toast.error('Failed to toggle audio');
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await videoService.startScreenShare();
        setIsScreenSharing(true);
      } else {
        await videoService.stopScreenShare();
        setIsScreenSharing(false);
      }
    } catch (err) {
      toast.error('Failed to toggle screen sharing');
    }
  };

  const endCall = () => {
    videoService.cleanup();
    // Navigate back or close consultation
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={initializeVideoCall}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Video Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-4 w-full max-w-6xl">
          {/* Local Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </motion.div>

          {/* Remote Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {participantName}
            </div>
            {connectionStatus === 'connecting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <p className="text-white">Connecting...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-600' : 'bg-red-500'
            }`}
          >
            <i className={`fas fa-microphone${isAudioEnabled ? '' : '-slash'}`} />
          </button>
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'
            }`}
          >
            <i className={`fas fa-video${isVideoEnabled ? '' : '-slash'}`} />
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full ${
              isScreenSharing ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <i className="fas fa-desktop" />
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500"
          >
            <i className="fas fa-phone-slash" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
