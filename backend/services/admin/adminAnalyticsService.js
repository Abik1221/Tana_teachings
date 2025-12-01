import User from '../../models/User.js';
import Job from '../../models/Job.js';
import Application from '../../models/Application.js';
import { ROLES } from '../../config/constants.js';

export class AdminAnalyticsService {
  /**
   * Get comprehensive dashboard overview
   */
  static async getDashboardOverview() {
    console.log('[AdminAnalyticsService] getDashboardOverview called');

    const [
      totalUsers,
      totalJobs,
      totalApplications,
      pendingJobs,
      pendingApplications,
      activeMentors,
      activeFamilies
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: 'pending_approval' }),
      Application.countDocuments({ status: 'pending_vetting' }),
      User.countDocuments({ role: ROLES.MENTOR, status: 'active' }),
      User.countDocuments({ role: ROLES.FAMILY, status: 'active' })
    ]);

    console.log('[AdminAnalyticsService] totals calculated:', {
      totalUsers, totalJobs, totalApplications, activeMentors, activeFamilies
    });

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    console.log('[AdminAnalyticsService] Calculating recent activity since:', oneWeekAgo);

    const recentStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Job.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
      Application.countDocuments({ appliedAt: { $gte: oneWeekAgo } })
    ]);

    console.log('[AdminAnalyticsService] recent activity stats:', recentStats);

    return {
      totals: {
        users: totalUsers,
        jobs: totalJobs,
        applications: totalApplications,
        activeMentors,
        activeFamilies
      },
      pending: {
        jobs: pendingJobs,
        applications: pendingApplications
      },
      recentActivity: {
        newUsers: recentStats[0],
        newJobs: recentStats[1],
        newApplications: recentStats[2],
        timeframe: '7d'
      },
      platformHealth: {
        approvalRate: totalJobs > 0 ? ((totalJobs - pendingJobs) / totalJobs * 100).toFixed(1) : 0,
        conversionRate: totalApplications > 0 ? ((totalApplications - pendingApplications) / totalApplications * 100).toFixed(1) : 0
      }
    };
  }

  /**
   * Get registration trends over time
   */
  static async getRegistrationTrends(timeframe = '30d') {
    console.log('[AdminAnalyticsService] getRegistrationTrends called with timeframe:', timeframe);

    const days = parseInt(timeframe);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    console.log('[AdminAnalyticsService] Registration trends start date:', startDate);

    const trends = await User.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, role: '$role' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          registrations: { $push: { role: '$_id.role', count: '$count' } },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('[AdminAnalyticsService] trends calculated:', trends.slice(0, 5)); // log first 5 for brevity

    return { trends, timeframe: `${days}d` };
  }

  /**
   * Get mentor performance metrics
   */
  static async getMentorPerformance(timeframe = '90d') {
    console.log('[AdminAnalyticsService] getMentorPerformance called with timeframe:', timeframe);

    const days = parseInt(timeframe);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    console.log('[AdminAnalyticsService] mentor performance start date:', startDate);

    const performance = await Application.aggregate([
      {
        $match: {
          appliedAt: { $gte: startDate },
          status: { $in: ['shortlisted', 'hired'] }
        }
      },
      {
        $group: {
          _id: '$mentor',
          totalApplications: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } }
        }
      },
      { $limit: 5 } // limit logs for brevity
    ]);

    console.log('[AdminAnalyticsService] mentor performance aggregated:', performance);

    return { performance, timeframe: `${days}d` };
  }

  /**
   * Get platform growth metrics
   */
  static async getPlatformGrowth() {
    console.log('[AdminAnalyticsService] getPlatformGrowth called');

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [currentMonth, previousMonth] = await Promise.all([
      this.getMonthlyStats(now),
      this.getMonthlyStats(lastMonth)
    ]);

    console.log('[AdminAnalyticsService] monthly stats calculated:', { currentMonth, previousMonth });

    const growthRates = {
      users: this.calculateGrowthRate(previousMonth.users, currentMonth.users),
      jobs: this.calculateGrowthRate(previousMonth.jobs, currentMonth.jobs),
      applications: this.calculateGrowthRate(previousMonth.applications, currentMonth.applications),
      mentors: this.calculateGrowthRate(previousMonth.mentors, currentMonth.mentors),
      families: this.calculateGrowthRate(previousMonth.families, currentMonth.families)
    };

    console.log('[AdminAnalyticsService] growth rates calculated:', growthRates);

    return { currentPeriod: currentMonth, previousPeriod: previousMonth, growthRates, timeframe: 'monthly' };
  }

  static async getMonthlyStats(date) {
    console.log('[AdminAnalyticsService] getMonthlyStats called for date:', date);

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const [users, jobs, applications, mentors, families] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Job.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      Application.countDocuments({ appliedAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      User.countDocuments({ role: ROLES.MENTOR, createdAt: { $gte: startOfMonth, $lte: endOfMonth } }),
      User.countDocuments({ role: ROLES.FAMILY, createdAt: { $gte: startOfMonth, $lte: endOfMonth } })
    ]);

    console.log('[AdminAnalyticsService] Monthly stats:', { users, jobs, applications, mentors, families });

    return {
      users,
      jobs,
      applications,
      mentors,
      families,
      period: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    };
  }

  static calculateGrowthRate(previous, current) {
    console.log('[AdminAnalyticsService] calculateGrowthRate called:', { previous, current });

    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  }
}
