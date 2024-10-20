import { asyncHandler } from "../../utils/asyncHandler.js"
import voucher_codes from "voucher-code-generator"
import { Coupon } from "../../../db/models/coupon.model.js"


  // create coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  // generate code
  const code = voucher_codes.generate({ length: 5})  // []

  const coupon = await Coupon.create({
    name: code[0],  // important
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(), // 15/10/2025  // month/day/year 
    // gettime >> turn the date into 1761339600000 >> bid number
    createdBy: req.user._id,
  })
  return res.status(201).json({ success: true, results: coupon})
})

// update coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  })

  if (!coupon) return next(new Error("Invalid code"))

  // check owner
  if (req.user.id !== coupon.createdBy.toString())
    return next(new Error("tou are not authorized"))  

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount

  coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt).getTime() : coupon.expiredAt

  await coupon.save()

  return res.json({ success: true, results: coupon, message: "coupon updated successfully"})
})

// delete coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
  })

  if (!coupon) return next(new Error("Invalid code"))
    
  // check owner
  if (req.user.id !== coupon.createdBy.toString())
    return next(new Error("tou are not authorized"))
 
  await Coupon.findOneAndDelete({name: req.params.code})

  return res.json({ success: true, message: "coupon deleted successfully"})
})

// read all coupons
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find()

  return res.json({ success: true, results: coupons})
})