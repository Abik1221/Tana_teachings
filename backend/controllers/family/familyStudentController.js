import { FamilyStudentService } from '../../services/family/familyStudentService.js';
import { catchAsync } from '../../utils/errors/catchAsync.js';
import { StatusCodes } from 'http-status-codes';

const familyStudentController = {
    /**
     * @desc    Add student to family
     * @route   POST /api/families/students
     * @access  Private/Family
     */
    addStudent: catchAsync(async (req, res) => {
        const student = await FamilyStudentService.addStudent(req.user.id, req.body);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Student added successfully',
            data: student
        });
    }),

    /**
     * @desc    Get all family students
     * @route   GET /api/families/students
     * @access  Private/Family
     */
    getStudents: catchAsync(async (req, res) => {
        const students = await FamilyStudentService.getStudentsByFamilyUserId(req.user.id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: students
        });
    }),

    /**
     * @desc    Get single student by ID
     * @route   GET /api/families/students/:id
     * @access  Private/Family
     */
    getStudentById: catchAsync(async (req, res) => {
        const student = await FamilyStudentService.getStudentById(req.params.id, req.user.id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: student
        });
    }),

    /**
     * @desc    Update student
     * @route   PATCH /api/families/students/:id
     * @access  Private/Family
     */
    updateStudent: catchAsync(async (req, res) => {
        const student = await FamilyStudentService.updateStudent(req.params.id, req.user.id, req.body);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    }),

    /**
     * @desc    Delete student (soft delete)
     * @route   DELETE /api/families/students/:id
     * @access  Private/Family
     */
    deleteStudent: catchAsync(async (req, res) => {
        await FamilyStudentService.deleteStudent(req.params.id, req.user.id);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Student deleted successfully'
        });
    }),

    /**
     * @desc    Get student stats
     * @route   GET /api/families/students/:id/stats
     * @access  Private/Family
     */
    getStudentStats: catchAsync(async (req, res) => {
        const student = await FamilyStudentService.getStudentById(req.params.id, req.user.id);
        res.status(StatusCodes.OK).json({
            success: true,
            data: student.stats || {}
        });
    })
};

export default familyStudentController;