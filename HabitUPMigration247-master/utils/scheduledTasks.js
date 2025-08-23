const cron = require('node-cron');
const { User, Habit, HabitProgress, sequelize } = require('../models');
const { sendEmail } = require('./emailService');
const emailTemplates = require('./emailTemplates');
const { Op } = require('sequelize');

class ScheduledTasks {
  // Initialize all scheduled tasks
  static init() {
    console.log('🕒 Initializing scheduled tasks...');
    
    // Daily habit reminders (9 AM every day)
    this.scheduleHabitReminders();
    
    // Streak milestone check (10 PM every day)
    this.scheduleStreakMilestones();
    
    // Weekly progress summary (Sunday 8 PM)
    this.scheduleWeeklyProgressSummary();
    
    // Clean up old messages (Every Sunday at 2 AM)
    this.scheduleMessageCleanup();
    
    // Subscription expiry reminders (Every day at 10 AM)
    this.scheduleSubscriptionReminders();

    console.log('✅ All scheduled tasks initialized');
  }

  // Daily habit reminders
  static scheduleHabitReminders() {
    cron.schedule('0 9 * * *', async () => {
      console.log('📧 Sending daily habit reminders...');
      
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get users with active habits who haven't completed them today
        const usersWithIncompleteHabits = await User.findAll({
          include: [{
            model: Habit,
            as: 'habits',
            where: { 
              isActive: true,
              reminderEnabled: true
            },
            include: [{
              model: HabitProgress,
              as: 'progress',
              where: {
                completionDate: today,
                completionStatus: 'COMPLETED'
              },
              required: false
            }]
          }]
        });

        // Send reminders to users
        for (const user of usersWithIncompleteHabits) {
          const incompleteHabits = user.habits.filter(habit => 
            !habit.progress || !habit.progress.length
          );

          if (incompleteHabits.length > 0) {
            await sendEmail(user.email, emailTemplates.habitReminder({
              name: user.name,
              habits: incompleteHabits
            }));
          }
        }

        console.log('✅ Daily habit reminders sent successfully');
      } catch (error) {
        console.error('❌ Error sending habit reminders:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  // Streak milestone check
  static scheduleStreakMilestones() {
    cron.schedule('0 22 * * *', async () => {
      console.log('🎯 Checking streak milestones...');

      try {
        const users = await User.findAll({
          include: [{
            model: Habit,
            as: 'habits',
            where: { isActive: true },
            include: ['progress']
          }]
        });

        const milestones = [7, 21, 30, 50, 100, 200, 365];

        for (const user of users) {
          for (const habit of user.habits) {
            const currentStreak = habit.calculateStreak();
            const previousStreak = habit.previousStreak || 0;

            // Check if user hit a milestone
            const achievedMilestone = milestones.find(m =>
              previousStreak < m && currentStreak >= m
            );

            if (achievedMilestone) {
              // Create achievement notification
              await Notification.create({
                userId: user.userId,
                type: 'ACHIEVEMENT_UNLOCKED',
                title: 'Streak Milestone Achieved! 🎉',
                message: `Congratulations! You've maintained your "${habit.name}" habit for ${achievedMilestone} days!`,
                metadata: {
                  habitId: habit.id,
                  milestone: achievedMilestone,
                  streak: currentStreak
                }
              });

              // Send congratulatory email
              await sendEmail(user.email, emailTemplates.streakMilestone({
                name: user.name,
                habitName: habit.name,
                milestone: achievedMilestone
              }));
            }

            // Update previous streak
            await habit.update({ previousStreak: currentStreak });
          }
        }

        console.log('✅ Streak milestones checked successfully');
      } catch (error) {
        console.error('❌ Error checking streak milestones:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  // Weekly progress summary
  static scheduleWeeklyProgressSummary() {
    cron.schedule('0 20 * * 0', async () => {
      console.log('📊 Generating weekly progress summaries...');

      try {
        const users = await User.findAll({
          include: [{
            model: Habit,
            as: 'habits',
            where: { isActive: true },
            include: [{
              model: HabitProgress,
              as: 'progress',
              where: {
                completionDate: {
                  [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              },
              required: false
            }]
          }]
        });

        for (const user of users) {
          const habitStats = user.habits.map(habit => {
            const totalDays = 7;
            const completedDays = habit.progress.filter(p =>
              p.completionStatus === 'COMPLETED'
            ).length;

            return {
              name: habit.name,
              completionRate: (completedDays / totalDays) * 100,
              streak: habit.calculateStreak(),
              completedDays,
              totalDays
            };
          });

          // Send weekly summary email
          await sendEmail(user.email, emailTemplates.weeklyProgress({
            name: user.name,
            stats: habitStats,
            weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            weekEndDate: new Date()
          }));
        }

        console.log('✅ Weekly progress summaries sent successfully');
      } catch (error) {
        console.error('❌ Error generating weekly summaries:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  // Clean up old messages and notifications
  static scheduleMessageCleanup() {
    cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Cleaning up old messages and notifications...');

      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

        // Archive old messages
        await sequelize.transaction(async (t) => {
          // Move messages to archive
          await sequelize.query(`
            INSERT INTO message_archives 
            SELECT * FROM messages 
            WHERE created_at < :thirtyDaysAgo
          `, {
            replacements: { thirtyDaysAgo },
            transaction: t
          });

          // Delete archived messages
          await Message.destroy({
            where: {
              createdAt: { [Op.lt]: thirtyDaysAgo }
            },
            transaction: t
          });

          // Delete old notifications
          await Notification.destroy({
            where: {
              createdAt: { [Op.lt]: ninetyDaysAgo },
              isRead: true
            }
          });
        });

        console.log('✅ Cleanup completed successfully');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  // Subscription expiry reminders
  static scheduleSubscriptionReminders() {
    cron.schedule('0 10 * * *', async () => {
      console.log('💳 Checking subscription expiries...');

      try {
        const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const today = new Date();

        const expiringSubscriptions = await Subscription.findAll({
          where: {
            endDate: {
              [Op.between]: [today, threeDaysFromNow]
            },
            status: 'ACTIVE'
          },
          include: [{
            model: User,
            attributes: ['email', 'name']
          }]
        });

        for (const subscription of expiringSubscriptions) {
          // Create notification
          await Notification.create({
            userId: subscription.userId,
            type: 'SUBSCRIPTION_EXPIRING',
            title: 'Subscription Expiring Soon',
            message: `Your subscription will expire on ${subscription.endDate.toLocaleDateString()}. Renew now to continue enjoying premium features!`,
            metadata: {
              subscriptionId: subscription.id,
              expiryDate: subscription.endDate
            }
          });

          // Send email reminder
          await sendEmail(subscription.User.email, emailTemplates.subscriptionExpiry({
            name: subscription.User.name,
            expiryDate: subscription.endDate,
            planType: subscription.planType
          }));
        }

        console.log('✅ Subscription reminders sent successfully');
      } catch (error) {
        console.error('❌ Error checking subscriptions:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  // Manual trigger for testing (can be called via API)
  static async sendTestReminder(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Habit,
          as: 'habits',
          where: { isActive: true }
        }]
      });

      if (user && user.habits.length > 0) {
        const emailData = emailTemplates.habitReminder(user.name, user.habits);
        
        await sendEmail({
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        });
        
        return { success: true, message: 'Test reminder sent successfully' };
      } else {
        return { success: false, message: 'User not found or has no active habits' };
      }
    } catch (error) {
      console.error('Error sending test reminder:', error);
      return { success: false, message: 'Failed to send test reminder' };
    }
  }
}

module.exports = ScheduledTasks;
