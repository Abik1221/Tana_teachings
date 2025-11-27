import Family from "../../models/Family.js";
import User from "../../models/User.js";
import AppError from "../../utils/errors/AppError.js";
import { StatusCodes } from "http-status-codes";
import { ROLES, USER_STATUS } from "../../config/constants.js";

export class FamilyService {
  static async createFamily(familyData, parentId) {
    // Check if user is a parent
    const parent = await User.findOne({
      _id: parentId,
      role: ROLES.FAMILY,
      status: USER_STATUS.ACTIVE,
    });
    if (!parent)
      throw new AppError("Invalid parent user", StatusCodes.BAD_REQUEST);

    // Check if family already exists
    const existingFamily = await Family.findOne({ parent: parentId });
    if (existingFamily)
      throw new AppError("Family already exists", StatusCodes.CONFLICT);

    const family = await Family.create({
      ...familyData,
      parent: parentId,
    });

    return await family.populate("parent", "name email");
  }

  static async getFamilyByParent(parentId) {
    const family = await Family.findOne({ parent: parentId }).populate(
      "parent",
      "name email"
    );
    if (!family) throw new AppError("Family not found", StatusCodes.NOT_FOUND);
    return family;
  }
}
