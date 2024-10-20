import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    }, 
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", unique: true },
        quantity: { type: Number, default: 1}
      }
    ]
  },
  { timestamps: true }
)

export const Cart = mongoose.model.Cart || model("Cart", cartSchema)