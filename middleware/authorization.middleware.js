import { asyncHandler } from "../utils/asyncHandler.js"

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    // check user
    if (role !== req.user.role)
      return next(new Error(" You are not authorized "))
    return next()
  })
}