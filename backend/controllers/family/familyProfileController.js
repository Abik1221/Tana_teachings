import { FamilyProfileService } from '../../services/family/familyProfileService.js';
import { catchAsync } from '../../utils/errors/catchAsync.js';
import { StatusCodes } from 'http-status-codes';

const familyProfileController = {
    /**
     * @desc    Get family profile
     * @route   GET /api/families/profile
     * @access  Private/Family
     */
    getProfile: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.getFamilyProfile(req.user.id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: family
        });
    }),

    /**
     * @desc    Create or update family profile
     * @route   POST /api/families/profile
     * @access  Private/Family
     */
    createOrUpdateProfile: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.createOrUpdateProfile(req.user.id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Family profile saved successfully',
            data: family
        });
    }),

    /**
     * @desc    Update family contact info
     * @route   PATCH /api/families/profile/contact
     * @access  Private/Family
     */
    updateContactInfo: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.updateContactInfo(req.user.id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Contact information updated successfully',
            data: family
        });
    }),

    /**
     * @desc    Update family address
     * @route   PATCH /api/families/profile/address
     * @access  Private/Family
     */
    updateAddress: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.updateAddress(req.user.id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Address updated successfully',
            data: family
        });
    }),

    /**
     * @desc    Update emergency contact
     * @route   PATCH /api/families/profile/emergency-contact
     * @access  Private/Family
     */
    updateEmergencyContact: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.updateEmergencyContact(req.user.id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Emergency contact updated successfully',
            data: family
        });
    }),

    /**
     * @desc    Get family stats
     * @route   GET /api/families/profile/stats
     * @access  Private/Family
     */
    getStats: catchAsync(async (req, res) => {
        const family = await FamilyProfileService.getFamilyProfile(req.user.id);
        // Assuming stats are calculated or populated in the service/model
        res.status(StatusCodes.OK).json({
            success: true,
            data: family.stats || {}
        });
    })
};

export default familyProfileController;