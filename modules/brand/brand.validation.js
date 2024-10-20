import joi from "joi"
import { isValidObjectId } from "../../middleware/validation.middleware.js"

// create brand 
export const createBrandSchema = joi
  .object({
    name: joi.string().min(4).max(15).required(),
  })
  .required()

// update brand
export const updateBrandSchema = joi.object({
  name: joi.string().min(4).max(15),
  brandId: joi.string().custom(isValidObjectId).required(),
})
.required()

// delete brand
export const deleteBrandSchema = joi.object(
  {
  brandId: joi.string().custom(isValidObjectId).required(),
  })
.required()