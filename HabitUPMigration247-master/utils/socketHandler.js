const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User, Doctor, Message, Habit, Meeting } = require('../models');
const { Op } = require('sequelize');

class SocketHandler {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user.userId;
        socket.userType = user.userType;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`🔌 User ${socket.userId} connected`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Join user to their personal room
      socket.join(`user:${socket.userId}`);

      // Handle chat messages
      socket.on('message:send', async (data) => {
        try {
          const { receiverId, message, type = 'TEXT' } = data;
          const receiverSocket = this.connectedUsers.get(receiverId);

          // Save message to database
          const savedMessage = await Message.create({
            senderId: socket.userId,
            receiverId,
            content: message,
            type
          });

          // Emit to sender and receiver
          this.io.to(socket.id).emit('message:sent', savedMessage);
          if (receiverSocket) {
            this.io.to(receiverSocket).emit('message:received', savedMessage);
          }
        } catch (error) {
          console.error('Error handling message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicators
      socket.on('typing:start', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('user:typing', {
          userId: socket.userId,
          conversationId
        });
      });

      socket.on('typing:stop', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('user:stopped_typing', {
          userId: socket.userId,
          conversationId
        });
      });

      // Handle video call signaling
      socket.on('video:offer', (data) => {
        const receiverSocket = this.connectedUsers.get(data.receiverId);
        if (receiverSocket) {
          this.io.to(receiverSocket).emit('video:offer', {
            ...data,
            senderId: socket.userId
          });
        }
      });

      socket.on('video:answer', (data) => {
        const receiverSocket = this.connectedUsers.get(data.receiverId);
        if (receiverSocket) {
          this.io.to(receiverSocket).emit('video:answer', {
            ...data,
            senderId: socket.userId
          });
        }
      });

      socket.on('video:ice-candidate', (data) => {
        const receiverSocket = this.connectedUsers.get(data.receiverId);
        if (receiverSocket) {
          this.io.to(receiverSocket).emit('video:ice-candidate', {
            ...data,
            senderId: socket.userId
          });
        }
      });

      // Handle joining/leaving consultations
      socket.on('consultation:join', ({ meetingId }) => {
        socket.join(`meeting:${meetingId}`);
        this.io.to(`meeting:${meetingId}`).emit('user:joined', {
          userId: socket.userId,
          name: socket.user.name
        });
      });

      socket.on('consultation:leave', ({ meetingId }) => {
        socket.leave(`meeting:${meetingId}`);
        this.io.to(`meeting:${meetingId}`).emit('user:left', {
          userId: socket.userId,
          name: socket.user.name
        });
      });

      // Handle habit completion updates
      socket.on('habit:complete', async ({ habitId }) => {
        try {
          const habit = await Habit.findByPk(habitId);
          if (habit) {
            // Broadcast to user's followers or accountability partners
            const followers = await User.findAll({
              include: [{
                model: User,
                as: 'following',
                where: { userId: socket.userId }
              }]
            });

            followers.forEach(follower => {
              const followerSocket = this.connectedUsers.get(follower.userId);
              if (followerSocket) {
                this.io.to(followerSocket).emit('habit:completed', {
                  userId: socket.userId,
                  userName: socket.user.name,
                  habitName: habit.name
                });
              }
            });
          }
        } catch (error) {
          console.error('Error handling habit completion:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 User ${socket.userId} disconnected`);
        this.connectedUsers.delete(socket.userId);

        // Notify relevant users about disconnection
        this.handleUserDisconnection(socket);
      });
    });

    console.log('🚀 Socket.IO initialized successfully');
  }

  // Helper method to handle user disconnection cleanup
  async handleUserDisconnection(socket) {
    try {
      // End any active consultations
      const activeMeetings = await Meeting.findAll({
        where: {
          [Op.or]: [
            { userId: socket.userId },
            { doctorId: socket.userId }
          ],
          status: 'IN_PROGRESS'
        }
      });

      for (const meeting of activeMeetings) {
        this.io.to(`meeting:${meeting.id}`).emit('consultation:ended', {
          meetingId: meeting.id,
          reason: 'participant_disconnected'
        });

        await meeting.update({ status: 'ENDED' });
      }

      // Notify chat participants
      const activeChats = await Message.findAll({
        attributes: ['conversationId'],
        where: {
          [Op.or]: [
            { senderId: socket.userId },
            { receiverId: socket.userId }
          ],
          createdAt: {
            [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        group: ['conversationId']
      });

      activeChats.forEach(chat => {
        this.io.to(`conversation:${chat.conversationId}`).emit('user:offline', {
          userId: socket.userId
        });
      });
    } catch (error) {
      console.error('Error handling disconnection cleanup:', error);
    }
  }

  // Method to emit notifications
  emitNotification(userId, notification) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      this.io.to(userSocket).emit('notification:new', notification);
    }
  }

  // Method to broadcast system announcements
  broadcastAnnouncement(message, userType = null) {
    if (userType) {
      // Broadcast to specific user type (e.g., 'DOCTOR', 'USER')
      this.io.emit('system:announcement', {
        message,
        userType,
        timestamp: new Date()
      });
    } else {
      // Broadcast to all users
      this.io.emit('system:announcement', {
        message,
        timestamp: new Date()
      });
    }
  }
}

// Export singleton instance
const socketHandler = new SocketHandler();
module.exports = socketHandler;
