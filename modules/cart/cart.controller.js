import { asyncHandler } from "../../utils/asyncHandler.js"
import { Product } from "../../../db/models/product.model.js"
import { Cart } from "../../../db/models/cart.model.js"

// add to cart 
export const addToCart = asyncHandler(async (req, res, next) => {
 // data >>  id , qty
 const { productId, quantity } = req.body

 // check product
 const product = await Product.findById(productId)
 if (!product ) return next(new Error ("product not found"), { cause: 404} )

 // check stock
 
//  if (quantity > product.availableItems ) return next(new Error(`Sorry, only ${product.availableItems} items left on the stock `))

  // add to cart
  // const cart = await Cart.findOne({ user: req.user._id})
  // cart.products.push({ productId, quantity })
  // await cart.save()

  if (!product.inStock(quantity)) 
    return next(new Error(`Sorry, only ${product.availableItems} items left on the stock `))

  // check the productId existence in db ??  >> Todo
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $push: { products: { productId, quantity } } },
    { new: true }
  )
 // response 
 return res.json({ 
  success: true, 
  results: cart,
  message: "product added successfully",
 })
})

// user cart
export const userCart = asyncHandler(async (req, res, next) => {

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId", "name defaultImage.url price discount finalPrice" ) // finalprice won't appear without price and discount 
  return res.json({ success: true, results: cart})
})


// update cart
export const updateCart = asyncHandler(async (req, res, next) => {
  // data >>  id , qty
 const { productId, quantity } = req.body

 // check product
 const product = await Product.findById(productId)
 if (!product ) return next(new Error ("product not found"), { cause: 404} )

 // check stock
 if (quantity > product.availableItems ) return next(new Error(`Sorry, only ${product.availableItems} items left on the stock `))

  // update cart
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    },
    { new: true }
  )

  // send response
  return res.json({ success: true, results: cart })
})

// remove product from cart
export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id},
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  )

  // send response
  return res.json({ success: true, results: cart, message: "product removed successfully " })
})

// clear cart
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id}, { products: [] })

  return res.json({ success: true, results: cart, message: "cart is cleared"})
})