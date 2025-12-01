import { AdminUserService } from '../../services/admin/adminUserService.js';
import  {catchAsync}  from '../../utils/errors/catchAsync.js';


export const adminUserController = {
  /**
   * @desc    Get all users with filtering
   * @route   GET /api/admin/users
   * @access  Private/Admin
   */
  getUsers: catchAsync(async (req, res) => {
    const result = await AdminUserService.getUsers(req.query);
    
    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  }),

  /**
   * @desc    Get user by ID with complete profile
   * @route   GET /api/admin/users/:id
   * @access  Private/Admin
   */
  getUser: catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const userData = await AdminUserService.getUserById(id);
    
    res.status(200).json({
      success: true,
      data: userData
    });
  }),

  /**
   * @desc    Update user status
   * @route   PATCH /api/admin/users/:id/status
   * @access  Private/Admin
   */
  updateUserStatus: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const user = await AdminUserService.updateUserStatus(id, status, req.user && req.user.id, adminNotes);
    
    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user
    });
  }),

  /**
   * @desc    Delete user (soft delete)
   * @route   DELETE /api/admin/users/:id
   * @access  Private/Admin
   */
  deleteUser: catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const result = await AdminUserService.deleteUser(id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  }),

  /**
   * @desc    Get platform statistics
   * @route   GET /api/admin/stats/platform
   * @access  Private/Admin
   */
  getPlatformStats: catchAsync(async (req, res) => {
    const stats = await AdminUserService.getPlatformStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  }),
  /**
   * @desc    Get user profile with role-specific data
   * @route   GET /api/admin/users/:id/profile
   * @access  Private/Admin
   */
  getUserProfile: catchAsync(async (req, res) => {
    const { id } = req.params;
      
    const userProfile = await AdminUserService.getUserById(id);
      
    res.status(200).json({
      success: true,
      data: userProfile
    });
  })
  
};