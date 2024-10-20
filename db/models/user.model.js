import mongoose, {Schema, model} from "mongoose"

// Schema
const userSchema = new Schema({
  userName : {
    type: String,
    required: true,
    min: 3,
    max: 20
  },
  email : {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password : {
    type: String,
    required: true
  },
  gender : {
    type: String,
    enum: ['male', 'female']
  },
  phone : {
    type: String
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  role : {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  forgetCode: String,
  activationCode: String,
  profileImage : {
    url: {
      type: String,
      default: "https://res.cloudinary.com/dvgt1ldcu/image/upload/v1710914910/ecommerce/user/profilePic_pvpdsu.jpg"
    },
    id : {
      type: String,
      default: "ecommerce/user/profilePic_pvpdsu"
    }
  },
  coverImage : [{url: {type: String, required: true}, id: {type: String, required: true}}]
},{timestamps: true})


// Model

export const User =  mongoose.models.User || model('User', userSchema)