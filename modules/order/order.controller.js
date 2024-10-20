import { asyncHandler } from "../../utils/asyncHandler.js"
import { Coupon } from "../../../db/models/coupon.model.js"
import { Cart } from "../../../db/models/cart.model.js"
import { Product } from "../../../db/models/product.model.js"
import { Order } from "../../../db/models/order.model.js"
import cloudinary from "../../utils/cloud.js"
import { sendEmail } from "../../utils/sendEmails.js"
import { createInvoice } from "../../../createInvoice.js"
import path from "path"
import { fileURLToPath } from "url"
import { clearCart, updateStock } from "./order.service.js"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// create order
export const createOrder = asyncHandler(async (req, res, next) => {
  // data
  const { payment, address, phone, coupon } = req.body
  // check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() }
    })
    if (!coupon) return next(new Error("Invalid Coupon")) 
  }

  // check cart
  const cart = await Cart.findOne({ user: req.user._id})
  const products = cart.products
  if (products.length < 1) return next(new Error("empty cart"))

  let orderProducts = []
  let orderPrice = 0  

  // check products
  for (let i = 0; i < products.length; i++) {
    // check product existence
    const product = await Product.findById(products[i].productId)
    if (!product) return next(new Error(`product ${products[i].productId} not found`))
    // check product stock
    if (!product.inStock(products[i].quantity)) return next(new Error(`${product.name} out of stock and only ${product.availableItems} items are left`))

  
  orderProducts.push({
    _id: false,
        productId: product._id,
        quantity: products[i].quantity,
        name: product.name,
        itemPrice: product.finalPrice,
        totalPrice: products[i].quantity * product.finalPrice,
  })

  orderPrice += products[i].quantity * product.finalPrice
  }
  // create order
   const order = await Order.create({
    user: req.user._id,
    products: orderProducts,
    address,
    phone,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
    payment,
    price: orderPrice,

   })

  // generate invoice
  const user = req.user
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id
  }

  const pdfPath = path.join(
    __dirname, `./../../../invoiceTemp/${order._id}.pdf`
  )


  createInvoice(invoice, pdfPath)
  // upload on cloudinary
  const { secure_url, public_id} = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`,
  })


  // TODO delete file from filesystem after uploading it to cloudinary 


  // add invoice to order
  order.invoice = { id: public_id, url: secure_url }
  await order.save()
  
   // send email
   const processOrder = async (order, user) => {
    try {
      // Send email
      const isSent = await sendEmail({
        to: user.email,
        subject: "Order invoice",
        html: "<p>Your order has been placed successfully.</p>",
        attachments: [{ path: secure_url, contentType: "application/pdf" }],
      });
  
      if (isSent) {
        console.log('Email sent successfully');
        // Update stock
        await updateStock(order.products);
        console.log('Updating stock for products:', order.products)
        // Clear cart
        await clearCart(user._id);
        console.log('Cart cleared successfully');
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };
  // response
  return res.json({ success: true, message: "order placed successfully . please check your email"})
})

