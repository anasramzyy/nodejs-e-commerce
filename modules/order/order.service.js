import { Cart } from "../../../db/models/cart.model.js";
import { Order } from "../../../db/models/order.model.js";
import { Product } from "../../../db/models/product.model.js";

// clear cart
export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId}, { products: [] })
}

// update stock
export const updateStock = async (products) => {
  try {
    for (const product of products) {
      await Product.findByIdAndUpdate(
        product.productId,
        {
          $inc: {
            availableItems: -product.quantity,
            soldItems: product.quantity,
          }
        }
      )
    }
    console.log("stock updated", Order.products)
  } catch (error) {
    console.error("error in", error)
  }
  
}