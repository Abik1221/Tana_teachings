import { MentorProfileService } from '../../services/mentor/mentorProfileService.js';
import { catchAsync } from '../../utils/errors/catchAsync.js';
import AppError from '../../utils/errors/AppError.js';
import { StatusCodes } from 'http-status-codes';

export const mentorProfileController = {
  /**
   * @desc    Get mentor profile
   * @route   GET /api/mentors/profile
   * @access  Private/Mentor
   */
  getProfile: catchAsync(async (req, res) => {
    const mentor = await MentorProfileService.getMentorProfile(req.user.id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: mentor
    });
  }),

  /**
   * @desc    Create or update mentor profile
   * @route   POST /api/mentors/profile
   * @access  Private/Mentor
   */
  createOrUpdateProfile: catchAsync(async (req, res) => {
    const profileData = req.body;
    const mentor = await MentorProfileService.createOrUpdateProfile(req.user.id, profileData);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Mentor profile updated successfully',
      data: mentor
    });
  }),

  /**
   * @desc    Update mentor availability
   * @route   PATCH /api/mentors/profile/availability
   * @access  Private/Mentor
   */
  updateAvailability: catchAsync(async (req, res) => {
    const { availability } = req.body;
    const mentor = await MentorProfileService.updateAvailability(req.user.id, availability);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Availability updated successfully',
      data: mentor
    });
  }),

  /**
   * @desc    Update mentor subjects and expertise
   * @route   PATCH /api/mentors/profile/subjects
   * @access  Private/Mentor
   */
  updateSubjects: catchAsync(async (req, res) => {
    const { subjects, expertise } = req.body;
    const mentor = await MentorProfileService.updateSubjects(req.user.id, { subjects, expertise });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subjects and expertise updated successfully',
      data: mentor
    });
  }),

  /**
   * @desc    Update mentor hourly rate
   * @route   PATCH /api/mentors/profile/hourly-rate
   * @access  Private/Mentor
   */
  updateHourlyRate: catchAsync(async (req, res) => {
    const { hourlyRate } = req.body;
    
    if (!hourlyRate || hourlyRate < 0) {
      throw new AppError('Valid hourly rate is required', StatusCodes.BAD_REQUEST);
    }

    const mentor = await MentorProfileService.updateHourlyRate(req.user.id, hourlyRate);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Hourly rate updated successfully',
      data: mentor
    });
  }),

  /**
   * @desc    Update mentor search visibility
   * @route   PATCH /api/mentors/profile/visibility
   * @access  Private/Mentor
   */
  updateVisibility: catchAsync(async (req, res) => {
    const { searchVisibility } = req.body;
    const mentor = await MentorProfileService.updateVisibility(req.user.id, searchVisibility);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Profile visibility ${searchVisibility ? 'enabled' : 'disabled'}`,
      data: mentor
    });
  }),

  /**
   * @desc    Get mentor statistics
   * @route   GET /api/mentors/profile/stats
   * @access  Private/Mentor
   */
  getStats: catchAsync(async (req, res) => {
    const stats = await MentorProfileService.getMentorStats(req.user.id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: stats
    });
  }),

  /**
   * @desc    Upload qualification document
   * @route   POST /api/mentors/profile/qualifications/documents
   * @access  Private/Mentor
   */
  uploadQualificationDocument: catchAsync(async (req, res) => {
    if (!req.file) {
      throw new AppError('Please upload a document', StatusCodes.BAD_REQUEST);
    }

    const { qualificationId } = req.body;
    const mentor = await MentorProfileService.uploadQualificationDocument(
      req.user.id, 
      qualificationId, 
      req.file
    );
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Document uploaded successfully',
      data: mentor
    });
  })
};