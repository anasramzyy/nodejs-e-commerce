import mongoose, { Schema, Types, model } from "mongoose";
// schema
export const categorySchema = new Schema(
  {
  name: { type: String, required: true, min: 4, max: 15 }, // Mobile Phone
  slug: { type: String, required: true }, // mobile-phone
  image: { 
    url: { type: String, required: true },
    id: { type: String, required: true}
  },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
  brandId: { type: Types.ObjectId, ref: "Brand"}
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


categorySchema.virtual("subcategory", {
  ref: "subCategory",
  localField: "_id",           // category model
  foreignField: "categoryId",  // subcategory model
})


// model 
export const Category = mongoose.models.Category || model("Category", categorySchema)