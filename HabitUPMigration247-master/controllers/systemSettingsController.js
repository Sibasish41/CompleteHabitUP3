            { '$User.role$': 'ADMIN' }
          ]
        },
        include: [{
          model: require('../models').User,
          as: 'modifier',
          attributes: ['userId', 'name', 'email'],
          required: false
        }],
const { SystemSetting } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
          required: false
        }],
        data: settings
        offset
      });

      res.json({
        success: true,
        data: {
  // Helper method to validate setting value against data type
  validateDataType(value, dataType) {
    switch (dataType.toLowerCase()) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        return typeof value === 'boolean' || value === 'true' || value === 'false';
      case 'json':
  // Update settings (admin only)
          JSON.parse(typeof value === 'string' ? value : JSON.stringify(value));
          return true;
        } catch {
          return false;
            returning: true
      default:
        return false;
        data: updates
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new setting (admin only)
  async createSetting(req, res, next) {
    try {
      const {
        settingKey,
        value,
        category,
        description,
        isPublic = false,
        dataType = 'string'
      } = req.body;

      // Check if setting already exists
      const existingSetting = await SystemSetting.findOne({
        where: { settingKey }
      });

      if (existingSetting) {
        return next(new ApiError('Setting key already exists', 400));
      }

      // Validate data type
      if (!this.validateDataType(value, dataType)) {
        return next(new ApiError('Invalid value for specified data type', 400));
      }

      const setting = await SystemSetting.create({
        settingKey,
        value,
        category,
        description,
        isPublic,
        dataType,
        createdBy: req.user.userId,
        lastModifiedBy: req.user.userId
      });

      // Clear settings cache
      await SystemSetting.clearCache();

      res.status(201).json({
        success: true,
        message: 'Setting created successfully',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete setting (admin only)
  async deleteSetting(req, res, next) {
    try {
      const { settingKey } = req.params;

      const setting = await SystemSetting.findOne({
        where: { settingKey }
      });

      if (!setting) {
        return next(new ApiError('Setting not found', 404));
      }

      // Check if setting is protected
      if (setting.isProtected) {
        return next(new ApiError('Cannot delete protected setting', 403));
      }

      await setting.destroy();

      // Clear settings cache
      await SystemSetting.clearCache();

      res.json({
        success: true,
        message: 'Setting deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get settings by category
  async getSettingsByCategory(req, res, next) {
    try {
      const { category } = req.params;

      const settings = await SystemSetting.findAll({
        where: {
          category,
          [Op.or]: [
            { isPublic: true },
        order: [['settingKey', 'ASC']]
      });

      // Convert to key-value pairs for easier consumption
      const settingsMap = {};
      for (const setting of settings) {
        settingsMap[setting.settingKey] = await SystemSetting.getValue(setting.settingKey);
      }

      res.json({
        success: true,
        data: settingsMap
      });
    } catch (error) {
      next(error);
    }
  }

  // Reset setting to default value
  async resetSetting(req, res, next) {
    try {
      const { key } = req.params;
      
      const setting = await SystemSetting.findOne({
        where: { settingKey: key }
      });

      if (!setting) {
        return next(new ApiError('Setting not found', 404));
      }

      if (setting.isReadOnly) {
        return next(new ApiError('Cannot reset read-only setting', 400));
      }

      if (!setting.defaultValue) {
        return next(new ApiError('No default value defined for this setting', 400));
      }

      await setting.update({
        settingValue: setting.defaultValue,
        lastModifiedBy: req.user.userId
      });

      res.json({
        success: true,
        message: 'Setting reset to default value successfully',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk update settings
  async bulkUpdateSettings(req, res, next) {
    try {
      const { settings } = req.body;
      
      if (!Array.isArray(settings)) {
        return next(new ApiError('Settings must be an array', 400));
      }

      const results = [];
      const errors = [];

      for (const settingData of settings) {
        try {
          const { settingKey, settingValue } = settingData;
          
          if (!settingKey) {
            errors.push({ settingKey, error: 'Setting key is required' });
            continue;
          }

          // Check if setting exists and is read-only
          const existingSetting = await SystemSetting.findOne({
            where: { settingKey }
          });

          if (existingSetting && existingSetting.isReadOnly) {
            errors.push({ settingKey, error: 'Cannot modify read-only setting' });
            continue;
          }

          const setting = await SystemSetting.setValue(settingKey, settingValue, req.user.userId);
          results.push({ settingKey, success: true, data: setting });
          
        } catch (error) {
          errors.push({ settingKey: settingData.settingKey, error: error.message });
        }
      }

      res.json({
        success: true,
        message: `Updated ${results.length} settings successfully`,
        data: {
          successful: results,
          failed: errors
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SystemSettingsController();
