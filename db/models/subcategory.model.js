import mongoose, { model, Schema, Types } from "mongoose"
import { Category } from "./category.model.js"

export const subCategorySchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 20 },
    slug: { type: String, required: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true
    },
    brand: [{
      type: Types.ObjectId,
      ref: "Brand"
    }]
    ,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
)

// model
export const subCategory = mongoose.subCategory || model("subCategory", subCategorySchema)