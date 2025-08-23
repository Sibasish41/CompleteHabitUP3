const { Doctor, Meeting, User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

class DoctorController {
  // Get all doctors with filters and pagination
  async getAllDoctors(req, res, next) {
    try {
      const {
        specialization,
        rating,
        page = 1,
        limit = 10
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereClause = {
        accountStatus: 'ACTIVE'
      };

      // Add specialization filter if provided
      if (specialization) {
        whereClause.specialization = specialization;
      }

      // Add minimum rating filter if provided
      if (rating) {
        whereClause.rating = { [Op.gte]: parseFloat(rating) };
      }

      const { count, rows: doctors } = await Doctor.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: {
          doctors,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalDoctors: count,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get specific doctor details by ID
  async getDoctorDetails(req, res, next) {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findByPk(doctorId);

      if (!doctor || doctor.accountStatus !== 'ACTIVE') {
        return next(new ApiError('Doctor not found', 404));
      }

      res.json({
        success: true,
        data: doctor
      });
    } catch (error) {
      next(error);
    }
  }

  // Get doctor availability
  async getDoctorAvailability(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return next(new ApiError('Doctor not found', 404));
      }

      // Get doctor's schedule
      const schedule = JSON.parse(doctor.schedule || '{}');
      const requestedDate = new Date(date);
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][requestedDate.getDay()];

      // Get day's schedule
      const daySchedule = schedule[dayOfWeek] || { available: false, slots: [] };

      if (!daySchedule.available) {
        return res.json({
          success: true,
          data: {
            available: false,
            message: 'Doctor is not available on this day'
          }
        });
      }

      // Get existing appointments for the date
      const existingMeetings = await Meeting.findAll({
        where: {
          doctorId,
          scheduledDate: {
            [Op.between]: [
              new Date(date).setHours(0, 0, 0, 0),
              new Date(date).setHours(23, 59, 59, 999)
            ]
          },
          status: {
            [Op.notIn]: ['CANCELLED', 'REJECTED']
          }
        },
        attributes: ['scheduledTime']
      });

      // Convert booked slots to Set for O(1) lookup
      const bookedSlots = new Set(existingMeetings.map(meeting => meeting.scheduledTime));

      // Filter available slots
      const availableSlots = daySchedule.slots.filter(slot => !bookedSlots.has(slot));

      res.json({
        success: true,
        data: {
          available: true,
          slots: availableSlots
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Book appointment with doctor
  async bookAppointment(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { scheduledDate, meetingType, agenda } = req.body;
      const userId = req.user.userId;

      const doctor = await Doctor.findByPk(doctorId);

      if (!doctor || doctor.accountStatus !== 'ACTIVE') {
        return next(new ApiError('Doctor not found', 404));
      }

      const newMeeting = await Meeting.create({
        userId,
        doctorId,
        scheduledDate,
        meetingType,
        agenda,
        status: 'SCHEDULED',
        fee: doctor.consultationFee
      });

      res.json({
        success: true,
        message: 'Appointment booked successfully',
        data: newMeeting
      });
    } catch (error) {
      next(error);
    }
  }

  // Rate doctor after meeting
  async rateDoctor(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { rating, feedback, meetingId } = req.body;

      const doctor = await Doctor.findByPk(doctorId);

      if (!doctor) {
        return next(new ApiError('Doctor not found', 404));
      }

      const meeting = await Meeting.findByPk(meetingId);

      if (!meeting || meeting.doctorId !== doctorId || meeting.userId !== req.user.userId) {
        return next(new ApiError('Meeting not found or unauthorized', 404));
      }

      if (meeting.status !== 'COMPLETED') {
        return next(new ApiError('Cannot rate doctor before meeting completion', 400));
      }

      await doctor.updateRating(rating);
      await meeting.update({ rating, feedback });

      res.json({
        success: true,
        message: 'Rating submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async scheduleMeeting(req, res, next) {
    try {
      const { doctorId } = req.params;
      const userId = req.user.userId;
      const { date, time, type, notes } = req.body;

      // Validate doctor exists
      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return next(new ApiError('Doctor not found', 404));
      }

      // Check if slot is available
      const existingMeeting = await Meeting.findOne({
        where: {
          doctorId,
          scheduledDate: date,
          scheduledTime: time,
          status: {
            [Op.notIn]: ['CANCELLED', 'REJECTED']
          }
        }
      });

      if (existingMeeting) {
        return next(new ApiError('This slot is already booked', 400));
      }

      // Calculate meeting fee
      const fee = type === 'VIDEO' ? doctor.videoConsultationFee : doctor.chatConsultationFee;

      // Create meeting
      const meeting = await Meeting.create({
        userId,
        doctorId,
        scheduledDate: date,
        scheduledTime: time,
        type,
        notes,
        fee,
        status: 'PENDING'
      });

      // Create payment session
      const payment = await this.createPaymentSession(meeting, req.user);

      res.status(201).json({
        success: true,
        data: {
          meeting,
          payment
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async createPaymentSession(meeting, user) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: user.email,
        client_reference_id: meeting.id,
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: `Consultation with Dr. ${meeting.Doctor.name}`,
                description: `${meeting.type} consultation on ${meeting.scheduledDate} at ${meeting.scheduledTime}`
              },
              unit_amount: meeting.fee * 100 // Convert to cents
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/consultation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/consultation/cancel?meeting_id=${meeting.id}`
      });

      return session;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      throw new ApiError('Failed to create payment session', 500);
    }
  }

  async getDoctorSchedule(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return next(new ApiError('Doctor not found', 404));
      }

      const meetings = await Meeting.findAll({
        where: {
          doctorId,
          scheduledDate: {
            [Op.between]: [startDate, endDate]
          },
          status: {
            [Op.notIn]: ['CANCELLED', 'REJECTED']
          }
        },
        include: [{
          model: User,
          attributes: ['name', 'email']
        }]
      });

      const schedule = JSON.parse(doctor.schedule || '{}');

      res.json({
        success: true,
        data: {
          schedule,
          meetings
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDoctorSchedule(req, res, next) {
    try {
      const { doctorId } = req.params;
      const { schedule } = req.body;

      const doctor = await Doctor.findByPk(doctorId);
      if (!doctor) {
        return next(new ApiError('Doctor not found', 404));
      }

      // Validate schedule format
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      for (const day of daysOfWeek) {
        if (schedule[day]) {
          if (typeof schedule[day].available !== 'boolean') {
            return next(new ApiError(`Invalid schedule format for ${day}`, 400));
          }
          if (schedule[day].available && (!Array.isArray(schedule[day].slots) || schedule[day].slots.length === 0)) {
            return next(new ApiError(`Invalid slots format for ${day}`, 400));
          }
        }
      }

      await doctor.update({ schedule: JSON.stringify(schedule) });

      res.json({
        success: true,
        message: 'Schedule updated successfully',
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to check slot availability
  async isSlotAvailable(doctorId, date, time) {
    const existingMeeting = await Meeting.findOne({
      where: {
        doctorId,
        scheduledDate: date,
        scheduledTime: time,
        status: {
          [Op.notIn]: ['CANCELLED', 'REJECTED']
        }
      }
    });

    return !existingMeeting;
  }
}

module.exports = new DoctorController();
