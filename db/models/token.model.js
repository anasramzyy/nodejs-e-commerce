import mongoose, {Schema, Types, model} from "mongoose";

// Schema 
const tokenSchema = new Schema({
  token : {
    type: String,
    required: true
  },
  user : {
    type: Types.ObjectId,
    ref: 'User'
  },
  isValid : {
    type: Boolean,
    default: true
  },
  agent : {
    type: String
  },
  expiredAt : {type: String}
},{timestamps: true})

// Model
export const Token = mongoose.models.Token || model('Token', tokenSchema)