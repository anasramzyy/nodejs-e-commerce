import { asyncHandler} from "../../utils/asyncHandler.js"
import { Product } from "../../../db/models/product.model.js"
import { nanoid } from "nanoid"
import cloudinary from "./../../utils/cloud.js"
import { Category } from "./../../../db/models/category.model.js"
import { subCategory} from "./../../../db/models/subcategory.model.js"
import { Brand } from "./../../../db/models/brand.model.js"


// create product
export const addProduct = asyncHandler(async (req, res, next) => {
  // data
  // const { name, description, availableItems, price, discount, category, subcategory, brand } = req.body

  //check category
  const category = await Category.findById(req.body.category)
  if (!category) return next(new Error("category not found"))

  //check subcategory
  const subcategory = await subCategory.findById(req.body.subcategory)
  if (!subcategory) return next(new Error("subcategory not found"))

  //check brand
  const brand = await Brand.findById(req.body.brand)
  if (!brand) return next(new Error("brand not found"))


  // files
  if (!req.files) return next(new Error("product images are required"), { cause: 400})

  // create unique folder name
  const cloudFolder = nanoid()
  let images = []
  // upload sub files
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path, {
        folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
      }
    )
    images.push({ id: public_id, url: secure_url})
  }

  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path, {
      folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`
    }
  )

  // create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images, // [{id:  , url:  }, {id:  ,url:  }]
  })

  // console.log("product1 with discount: ", product.finalPrice)

  // send response
  return res.json({ success: true, results: product})
})

// delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product 
  const product = await Product.findById(req.params.productId)
  if (!product) return next(new Error("product not found"))

  // check owner
  if (req.user._id.toString() != product.createdBy.toString())
    return next(new Error("not authorized" , { cause: 401 }))

  const imagesArr = product.images;  // [{id: , url: }, { id: , url: }]
  const publicIds = imagesArr.map((imageObj) => imageObj.id)
  console.log(publicIds)
  publicIds.push(product.defaultImage.id) // add default image id

  // delete images   // required

  const result = await cloudinary.api.delete_resources(publicIds);
  console.log(result)

  // delete folder  >> in condition it's empty 
  await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`)

  // delete product from db
  await Product.findByIdAndDelete(req.params.productId)
  // send response
  return res.json({ success: true, message: "product deleted successfully"})
})

// 
export const allProducts = asyncHandler(async (req, res, next) => {
   // products of certain category
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId)
    if (!category) return next(new Error("category not found"), { cause: 404 })

    const products = await Product.find({ category: req.params.categoryId})
    return res.json({ success: true, results: products })
  }
  // // // data ? search by name
  // // const { name } = req.query
  // // const products = await Product.find({ name: { $regex: req.query.name} })


  // // // data page
  // // const { page } = req.query // 2
  // // const limit = 2
  // // const skip = limit * (page - 1) // 2 * (2-1) = 2


// **************** Search *************** //
  // const { keyword } = req.query
  // const products = await Product.find({
  //   $or: [
  //     { name: { $regex: keyword, $options: "i" } }, // case insensetive // Oppo  == oppo
  //     { description: { $regex: keyword, $options: "i" } }
  //   ],
  // })



  const products = await Product.find({ ...req.query }) // filter
    .paginate(req.query.page)   // pagination
    .customSelect(req.query.fields)   // selection
    .sort(req.query.sort)   // sort

  return res.json({ success: true, results: products})
})

// single product
export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId)
  if (!product) return next(new Error("product not found"))
  return res.json({ success: true, results: product})
})