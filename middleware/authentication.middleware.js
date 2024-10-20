import { asyncHandler } from "./../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { Token } from "./../../db/models/token.model.js"
import { User } from './../../db/models/user.model.js'

export const isAuthenticated = asyncHandler(async(req, res, next) => {
  // check token existence and type
  let token = req.headers["token"]
  if (!token || !token.startsWith(process.env.BEARER_KEY)) return next(new Error("Valid Token Is required", 400))  
    
  // check payload
  token = token.split(process.env.BEARER_KEY)[1]
  const decoded = jwt.verify(token, process.env.TOKEN_KEY)
  if (!decoded) return next(new Error("Invalid Token"))

  // check token in db
  const tokenDb = await Token.findOne({ token, isValid: true })
  if (!tokenDb) return next(new Error("Token Expired"))

  // check user existence
  const user = await User.findOne({ email: decoded.email })
  if (!user) return next(new Error("User Not Found"))

  // pass user
  req.user = user

  // return next
  return next()
})