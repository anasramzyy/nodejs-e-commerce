import slugify from "slugify"
import { Category } from "../../../db/models/category.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { subCategory } from "../../../db/models/subcategory.model.js"
import cloudinary from "../../utils/cloud.js"

// create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  // data
  const { name } = req.body
  // categoryid 
  const { categoryId } = req.params

  // check file
  if(!req.file) return next(new Error("Image is required", { cause: 400 }))

  // check category
  const category = await Category.findById(categoryId)
  if(!category) return next(new Error("category not found"), { cause: 404 })

  // upload file
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path, {
      folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory`,
    } 
  )
  // save in database
  const subcategory = await subCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    categoryId,
  })

  return res.json({ success: true, results: subcategory})
})

// update
export const updateSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId)
  if (!category) return next(new Error("category not found", {cause: 404}))

  // check subcategory
  const subcategory = await subCategory.findOne({
    _id: req.params.subCategoryId,
    categoryId: req.params.categoryId // check parent
  })
  if (!subcategory) return next(new Error("subcategory not found", {cause: 404}))

  // check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("you are not authorized"))

  subcategory.name = req.body.name ? req.body.name : subcategory.name
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug

  // file
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id
    })
    subcategory.image.url = secure_url
  }
  await subcategory.save()

  return res.json({
    success: true, message: "subcategory updated successfully",
    results: subcategory
  })
})

// delete
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId)
  if (!category) return next(new Error("category not found", {cause: 404}))

  // check subcategory and delete
  const subcategory = await subCategory.findOneAndDelete({
    _id: req.params.subCategoryId,
    categoryId: req.params.categoryId // check parent
  })
  if (!subcategory) return next(new Error("subcategory not found", {cause: 404}))

  // check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("you are not authorized"))

  return res.json({
    success: true, message: "subcategory deleted successfully"
  })
})

// get all categories
export const allSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await subCategory.find().populate([{
    path: "categoryId",
    select: "name"
  }, {
    path: "createdBy"
  }])

  return res.json({ success: true, results: subcategories})
})