import mongoose, { Schema, Types, model} from "mongoose";

// schema
const productSchema = new Schema({
  name: { type: String, required: true, min: 2, max: 20},
  description: String,
  images: [
    {
      id: { type: String, required: true},
      url: { type: String, required: true}
    }
  ],
  defaultImage: {
    id: { type: String, required: true},
    url: { type: String, required: true}
  },
  availableItems: { type: Number, min: 1, required: true },
  soldItems: { type: Number, default: 0 },
  price: { type: Number, min: 1, required: true },
  discount: { type: Number, min: 1, max: 100 },   // %
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
  category: { type: Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: Types.ObjectId, ref: "Subcategory", required: true },
  brand: { type: Types.ObjectId, ref: "Brand", required: true },
  cloudFolder: { type: String, unique: true }
}, 
{ timestamps: true, 
  strictQuery: true,   // it ignore any thing not in the model and continue
  toJSON: { virtuals: true }
 })

// virtual
productSchema.virtual("finalPrice").get(function () {
  // this  >>>  document  >> product
                //   ( 1 )    //
  // // calculate final price
  // if (this.discount > 0) {
  //   return this.price - (this.price * this.discount)  / 100
  // }
  // return this.price

               //  ( 2 )   //   
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2)
  }
  
})

productSchema.query.paginate = function (page) {
  
  // *************** pagination ************* //
  // this >> query
  // return query
  
  page = !page || page < 1 || isNaN(page) ? 1 : page
  const limit = 2
  const skip = (page - 1) * limit

  return this.skip(skip).limit(limit)
}

productSchema.query.customSelect = function (fields) {
  // ************ selection *********** //

  if (!fields) return this
  // model keys
  const modelKeys = Object.keys(Product.schema.paths) // array of the model keys ['name',  'slug', 'images']

  // queryKeys
  const queryKeys = fields.split(" ")

  // matchedKeys
  const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key))

  return this.select(matchedKeys)
}

productSchema.methods.inStock = function (requiredQuantity) {
  // this >> doc  >> product document
  return this.availableItems >= requiredQuantity ? true : false
}

//model
export const Product = mongoose.models.Product || model("Product", productSchema)