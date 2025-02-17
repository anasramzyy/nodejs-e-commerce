import { Category } from "../../../db/models/category.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import slugify from "slugify"
import cloudinary from "./../../utils/cloud.js"
import { subCategory } from "../../../db/models/subcategory.model.js"


// create category
export const createCategory = asyncHandler(async (req, res, next) => {
  
  // file
  if (!req.file) return next(new Error("category image is required"))

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `${process.env.FOLDER_CLOUD_NAME}/category` })
 
  // save category in db
  const category = await Category.create({
    name: req.body.name,
    createdBy: req.user._id,
    image: {
      id: public_id , url: secure_url 
    },
    slug: slugify(req.body.name),
  })

  // send response 
  return res.json({ success: true, results: category}).status(201)
})


// update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId)
  if (!category) return next(new Error("category not found"))


  // check owner
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("you are not authorized"))

  // name  
  category.name = req.body.name ? req.body.name : category.name

  // slug
  category.slug = req.body.name ? slugify(req.body.name) : category.slug

  // files
  if (req.file) {
    const { secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, 
      {
      public_id: category.image.id
    })
    category.image.url = secure_url
    category.image.id = public_id
  }

  // save category
  await category.save()

  // return response
  return res.json({ success: true })
})

// delete category 
export const deleteCategory = asyncHandler(async (req, res, next) => {

  
  // check category existence
  const category = await Category.findById(req.params.categoryId)
  if (!category) return next(new Error("category not found"))


  // check owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("you are not authorized"))

  // delete image
  const result = await cloudinary.uploader.destroy(category.image.id)
  console.log(result)

  // delete category
  // await category.remove()

  await Category.findByIdAndDelete(req.params.categoryId)

  // delete subcategories
  await subCategory.deleteMany({ categoryId: req.params.categoryId})

  return res.json ({ success: true, message: "category deleted successfully"})
})

// get categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate({
    path: "subcategory", // populate
    populate: [{ path: "createdBy" }] // nested populate
  })
  console.log(categories)
  return res.json({ success: true, results: categories})
})