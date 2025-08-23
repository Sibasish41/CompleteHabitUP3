      );
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

        message: 'Conversation marked as read'
  // Send a message
  async sendMessage(req, res, next) {
    try {
      const { receiverId, receiverType, messageContent, messageType = 'TEXT', priority = 'NORMAL' } = req.body;
      const senderId = req.user.userId;
      const senderType = req.user.userType || 'USER';

      // Validate receiver exists
      let receiver;
      if (receiverType === 'DOCTOR') {
        receiver = await Doctor.findByPk(receiverId);
      } else if (receiverType === 'USER') {
        receiver = await User.findByPk(receiverId);
      }

      if (!receiver) {
        return next(new ApiError('Receiver not found', 404));
      }

      // Generate conversation ID
      const conversationId = Message.generateConversationId(
        senderId, senderType, receiverId, receiverType
      );

      const message = await Message.create({
        senderId,
        senderType,
        receiverId,
        receiverType,
        messageContent,
        messageType,
        conversationId,
        priority
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      next(error);
    }
  }

  // Get messages for a conversation
  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user.userId;

      // Verify user is part of the conversation
      const isParticipant = await Message.findOne({
        where: {
          conversationId,
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      });

      if (!isParticipant) {
        return next(new ApiError('Not authorized to access this conversation', 403));
      }

      const { count, rows: messages } = await Message.findAndCountAll({
        where: { conversationId },
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['name', 'email', 'profilePhoto']
          },
          {
            model: User,
            as: 'receiver',
            attributes: ['name', 'email', 'profilePhoto']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      // Mark messages as read
      await Message.update(
        { isRead: true },
        {
          where: {
            conversationId,
            receiverId: userId,
            isRead: false
          }
        }
      );

      res.json({
        success: true,
        data: {
          messages: messages.reverse(),
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit))
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's conversations
  async getConversations(req, res, next) {
    try {
      const userId = req.user.userId;
      const { page = 1, limit = 20 } = req.query;

      const conversations = await Message.findAll({
        attributes: [
          'conversationId',
          [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageTime']
        ],
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        group: ['conversationId'],
        order: [[sequelize.fn('MAX', sequelize.col('createdAt')), 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
          const lastMessage = await Message.findOne({
            where: { conversationId: conv.conversationId },
            order: [['createdAt', 'DESC']],
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['name', 'email', 'profilePhoto']
              },
              {
                model: User,
                as: 'receiver',
                attributes: ['name', 'email', 'profilePhoto']
              }
            ]
          });

          const unreadCount = await Message.count({
            where: {
              conversationId: conv.conversationId,
              receiverId: userId,
              isRead: false
            }
          });

          return {
            ...conv.toJSON(),
            lastMessage,
            unreadCount
          };
        })
      );

      res.json({
        success: true,
        data: conversationsWithDetails
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete message (soft delete)
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;

      const message = await Message.findOne({
        where: {
          id: messageId,
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      });

      if (!message) {
        return next(new ApiError('Message not found', 404));
      }

      await message.update({
        deletedFor: message.deletedFor ?
          [...new Set([...message.deletedFor, userId])] :
          [userId]
      });

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get unread messages count
  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.userId;

      const count = await Message.count({
        where: {
          receiverId: userId,
          isRead: false
        }
      });

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark conversation as read
  async markConversationAsRead(req, res, next) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.userId;

      await Message.update(
        { isRead: true },
        {
          where: {
            conversationId,
            receiverId: userId,
            isRead: false
          }
        }
      });

      res.json({
        success: true,
        data: { unreadCount }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
