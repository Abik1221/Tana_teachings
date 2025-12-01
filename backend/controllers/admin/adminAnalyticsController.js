import  {catchAsync}  from '../../utils/errors/catchAsync.js';
import { AdminAnalyticsService } from '../../services/admin/adminAnalyticsService.js';

export const adminAnalyticsController = {
  /**
   * @desc    Get dashboard overview with key metrics
   * @route   GET /api/admin/dashboard/overview
   * @access  Private/Admin
   */
  getDashboardOverview: catchAsync(async (req, res) => {
    const overview = await AdminAnalyticsService.getDashboardOverview();
    
    res.status(200).json({
      success: true,
      data: overview
    });
  }),

  /**
   * @desc    Get registration trends over time
   * @route   GET /api/admin/reports/registration-trends
   * @access  Private/Admin
   */
  getRegistrationTrends: catchAsync(async (req, res) => {
    const { timeframe = '30d' } = req.query;
    const trends = await AdminAnalyticsService.getRegistrationTrends(timeframe);
    
    res.status(200).json({
      success: true,
      data: trends
    });
  }),

  /**
   * @desc    Get mentor performance metrics
   * @route   GET /api/admin/reports/mentor-performance
   * @access  Private/Admin
   */
  getMentorPerformance: catchAsync(async (req, res) => {
    const { timeframe = '90d' } = req.query;
    const performance = await AdminAnalyticsService.getMentorPerformance(timeframe);
    
    res.status(200).json({
      success: true,
      data: performance
    });
  }),

  /**
   * @desc    Get platform growth metrics
   * @route   GET /api/admin/reports/platform-growth
   * @access  Private/Admin
   */
  getPlatformGrowth: catchAsync(async (req, res) => {
    const growth = await AdminAnalyticsService.getPlatformGrowth();
    
    res.status(200).json({
      success: true,
      data: growth
    });
  })
};