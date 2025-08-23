import axios from 'axios';
import { API_BASE_URL } from '../config';

class VideoService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.socket = null;
    this.iceCandidates = [];
  }

  async initializeConnection(meetingId, userId, isDoctor) {
    try {
      // Get turn server credentials
      const response = await axios.get(
        `${API_BASE_URL}/meetings/${meetingId}/turn-credentials`,
        { withCredentials: true }
      );
      const { iceServers } = response.data.data;

      // Initialize WebRTC connection
      this.peerConnection = new RTCPeerConnection({ iceServers });

      // Set up event handlers
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket?.emit('ice-candidate', {
            meetingId,
            userId,
            candidate: event.candidate
          });
        }
      };

      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        if (this.onRemoteStream) {
          this.onRemoteStream(this.remoteStream);
        }
      };

      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Add tracks to peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // Return local stream for local video preview
      return this.localStream;
    } catch (error) {
      console.error('Error initializing video connection:', error);
      throw error;
    }
  }

  async createOffer(meetingId, userId) {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer to remote peer
      this.socket?.emit('video-offer', {
        meetingId,
        userId,
        offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleOffer(offer, meetingId, userId) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Send answer to remote peer
      this.socket?.emit('video-answer', {
        meetingId,
        userId,
        answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

      // Add any ice candidates that were received before the answer
      this.iceCandidates.forEach(candidate => {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });
      this.iceCandidates = [];
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  handleIceCandidate(candidate) {
    try {
      if (this.peerConnection.remoteDescription) {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        // Store ice candidates until we have the remote description
        this.iceCandidates.push(candidate);
      }
    } catch (error) {
      console.error('Error handling ice candidate:', error);
      throw error;
    }
  }

  // Toggle video
  async toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  // Toggle audio
  async toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  // Screen sharing
  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s =>
        s.track?.kind === 'video'
      );

      if (sender) {
        sender.replaceTrack(videoTrack);
      }

      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  // Stop screen sharing
  async stopScreenShare() {
    try {
      const videoTrack = this.localStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s =>
        s.track?.kind === 'video'
      );

      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
    } catch (error) {
      console.error('Error stopping screen share:', error);
      throw error;
    }
  }

  // Clean up resources
  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.iceCandidates = [];
    this.remoteStream = null;
  }
}

export default new VideoService();
