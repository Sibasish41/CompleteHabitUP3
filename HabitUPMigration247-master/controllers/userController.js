const { User, Habit, HabitProgress, Permission } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Op } = require('sequelize');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'uploads/profile_photos';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed', 400));
    }
  }
});

class UserController {
  // Get current user profile
  async getCurrentUser(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        include: [
          {
            model: Permission,
            as: 'permissions',
            through: { attributes: [] }
          },
          {
            model: Habit,
            as: 'habits',
            through: { attributes: [] },
            where: { isActive: true },
            required: false
          }
        ]
      });

      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Exclude sensitive fields
      const userData = user.toJSON();
      delete userData.password;

      res.json({
        success: true,
        data: userData
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const {
        name,
        dob,
        phoneNo,
        gender
      } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Check if phone number is being changed and if it's already taken
      if (phoneNo && phoneNo !== user.phoneNo) {
        const existingUser = await User.findOne({ 
          where: { 
            phoneNo,
            userId: { [Op.ne]: userId }
          }
        });
        
        if (existingUser) {
          return next(new ApiError('Phone number already exists', 400));
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (dob) updateData.dob = dob;
      if (phoneNo) updateData.phoneNo = phoneNo;
      if (gender) updateData.gender = gender;

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Update profile photo
  async updateProfilePhoto(req, res, next) {
    try {
      const userId = req.user.userId;

      if (!req.file) {
        return next(new ApiError('No file uploaded', 400));
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Convert image to base64
      const imageBuffer = await fs.readFile(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

      // Update user profile photo
      await user.update({ profilePhoto: base64Image });

      // Delete uploaded file
      await fs.unlink(req.file.path);

      res.json({
        success: true,
        message: 'Profile photo updated successfully',
        data: {
          profilePhoto: base64Image
        }
      });
    } catch (error) {
      // Clean up uploaded file if error occurs
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }
      next(error);
    }
  }

  // Get user profile photo
  async getProfilePhoto(req, res, next) {
    try {
      const { email } = req.params;
      
      const user = await User.findOne({ where: { email } });
      if (!user || !user.profilePhoto) {
        return next(new ApiError('Profile photo not found', 404));
      }

      res.json({
        success: true,
        data: {
          profilePhoto: user.profilePhoto
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return next(new ApiError('Current password is incorrect', 400));
      }

      // Update password
      await user.update({ password: newPassword });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user dashboard data
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.userId;

      // Fetch user with related data
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Habit,
            as: 'habits',
            where: { isActive: true },
            required: false,
            include: [{
              model: HabitProgress,
              required: false,
              where: {
                date: {
                  [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
                }
              }
            }]
          }
        ]
      });

      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Calculate dashboard statistics
      const habits = user.habits || [];
      const totalHabits = habits.length;
      const activeHabits = habits.filter(h => h.isActive).length;
      const completedHabits = habits.filter(h => h.isCompleted).length;

      // Calculate streak and progress
      const habitProgress = habits.map(habit => {
        const progress = habit.HabitProgresses || [];
        const streak = this.calculateStreak(progress);
        const completionRate = progress.length > 0
          ? (progress.filter(p => p.completed).length / progress.length) * 100
          : 0;

        return {
          habitId: habit.id,
          name: habit.name,
          streak,
          completionRate,
          lastUpdated: progress.length > 0 ? progress[progress.length - 1].date : null
        };
      });

      res.json({
        success: true,
        data: {
          totalHabits,
          activeHabits,
          completedHabits,
          habitProgress,
          user: {
            name: user.name,
            email: user.email,
            joinDate: user.createdAt
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  calculateStreak(progress) {
    if (!progress.length) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = progress.length - 1; i >= 0; i--) {
      const progressDate = new Date(progress[i].date);
      progressDate.setHours(0, 0, 0, 0);

      const daysDifference = Math.floor((today - progressDate) / (1000 * 60 * 60 * 24));

      if (progress[i].completed) {
        if (daysDifference === streak) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  }

  // Get user statistics
  async getStatistics(req, res, next) {
    try {
      const userId = req.user.userId;
      const { period = '30' } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const [
        totalHabits,
        completedHabits,
        habitProgress,
        categoryStats
      ] = await Promise.all([
        // Total active habits
        Habit.count({
          include: [{
            model: User,
            as: 'users',
            where: { userId },
            through: { attributes: [] }
          }],
          where: { isActive: true }
        }),

        // Completed habits in period
        HabitProgress.count({
          where: {
            userId,
            completionDate: {
              [Op.gte]: startDate.toISOString().split('T')[0]
            },
            completionStatus: 'COMPLETED'
          }
        }),

        // Daily progress over period
        HabitProgress.findAll({
          where: {
            userId,
            completionDate: {
              [Op.gte]: startDate.toISOString().split('T')[0]
            }
          },
          attributes: [
            'completionDate',
            'completionStatus'
          ],
          order: [['completionDate', 'ASC']]
        }),

        // Habit categories statistics
        Habit.findAll({
          include: [{
            model: User,
            as: 'users',
            where: { userId },
            attributes: [],
            through: { attributes: [] }
          }],
          attributes: [
            'habitCategory',
            'currentStreak',
            'longestStreak'
          ],
          where: { isActive: true }
        })
      ]);

      // Process daily progress
      const dailyStats = {};
      habitProgress.forEach(progress => {
        const date = progress.completionDate;
        if (!dailyStats[date]) {
          dailyStats[date] = { completed: 0, total: 0 };
        }
        dailyStats[date].total++;
        if (progress.completionStatus === 'COMPLETED') {
          dailyStats[date].completed++;
        }
      });

      // Process category statistics
      const categoryBreakdown = {};
      categoryStats.forEach(habit => {
        const category = habit.habitCategory;
        if (!categoryBreakdown[category]) {
          categoryBreakdown[category] = {
            count: 0,
            totalCurrentStreak: 0,
            maxStreak: 0
          };
        }
        categoryBreakdown[category].count++;
        categoryBreakdown[category].totalCurrentStreak += habit.currentStreak;
        categoryBreakdown[category].maxStreak = Math.max(
          categoryBreakdown[category].maxStreak,
          habit.longestStreak
        );
      });

      res.json({
        success: true,
        data: {
          period: parseInt(period),
          overview: {
            totalHabits,
            completedHabits,
            completionRate: totalHabits > 0 ? (completedHabits / (totalHabits * parseInt(period)) * 100).toFixed(2) : 0
          },
          dailyProgress: dailyStats,
          categoryBreakdown,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user account
  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ApiError('User not found', 404));
      }

      // Verify password before deletion
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ApiError('Password is incorrect', 400));
      }

      // Delete user data
      await HabitProgress.destroy({ where: { userId } });
      
      // Remove user from habits
      const userHabits = await user.getHabits();
      await user.removeHabits(userHabits);

      // Delete user
      await user.destroy();

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Export multer upload middleware
  static getUploadMiddleware() {
    return upload.single('profilePhoto');
  }
}

module.exports = new UserController();
