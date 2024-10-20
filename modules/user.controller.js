import { User } from "./../../db/models/user.model.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import randomstring from 'randomstring'
import { sendEmail } from "./../utils/sendEmails.js";
import { resetPassTemp, signUpTemp } from './../utils/generateHtml.js'
import { Token } from './../../db/models/token.model.js'
import { Cart } from "../../db/models/cart.model.js";
import jwt from 'jsonwebtoken'


// register
export const register = asyncHandler(async (req, res, next) => {
  // data from request 
  const {userName, email, password} = req.body
  // check user existence 
  const isUser = await User.findOne({email})
  if(isUser) return next(new Error('Email Is Already Registered', {cause: 409}))
  // hash password
  const hashPassword  = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND))
  // generate activationCode // or: generate token with payload email 
  const activationCode = crypto.randomBytes(64).toString('hex')
  
  // create user
  const user = await User.create({userName, email, password: hashPassword, activationCode})
  // create confirmationLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`

  // send email
  const isSent = await sendEmail({to: email, subject: "Activate Account", html: signUpTemp(link)})

  // send response
  return isSent ? res.json({success: true, message: "please review your email"}) : next(new Error('something went wrong'))
})


// activateAccount 
export const activateAccount = asyncHandler(async (req, res, next) => {
  // find user , delete the activationcode , update isconfirmed
  const user = await User.findOne({activationCode: req.params.activationCode})

  // check if the user doesn't exist 
  if (!user) return next(new Error('user not found', {cause: 404}))


  // update 
  await User.findByIdAndUpdate(user._id, {
    $set: { isConfirmed: true },
    $unset: { activationCode: 1},
  })

  // create a cart 
  await Cart.create({ user: user._id })

  // send response 
  return res.send("your account is now activated, log in now")
})

// login
export const login = asyncHandler(async (req, res, next)=> {
  // data from request 
  const { email, password } = req.body

  // check user existense
  const user = await User.findOne({ email })
  if (!user) return next(new Error("invalid Email"), { cause: 400 })

  // check isconfirmed
  if (!user.isConfirmed) return next(new Error("un Activated Account", { cause: 400})) 

  // check password
  const match = bcryptjs.compareSync(password, user.password)
  if (!match) return next(new Error('invalid password',{ cause : 400}))
  
  // generate token 
  const token = jwt.sign(
    { id: user._id, email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: '2d',
    })

  // save token in token model 
  await Token.create({
    token, 
    user: user._id, 
    agent: req.headers['user-agent']
  })

  // change user status to online and save user
  user.status = 'online'
  await user.save()

  // send response 
  return res.json({ success: true, results: token})
})

//send forget code 
export const sendForgetCode = asyncHandler(async (req, res, next) => {

  if (!req.body.email|| req.body.email.trim() === '') {
    return res.status(400).json({ error: 'Invalid //emailo' });
   }

  // check user 
  const user = await User.findOne({ email: req.body.email }).exec()
  if (!user) return next(new Error('user not found'))

  // generate code 
  const code = randomstring.generate({
    length: 5,
    charset: "numeric"
  })

  // save code in db
  await User.updateOne({ _id: user._id }, { $set: { forgetCode: code } })

  // send email 
  return (await sendEmail({
    to: user.email,
    subject: 'reset password', 
    html: resetPassTemp(code)
  }))
  ? res.json({ success: true, message: 'check your email'})
  : next (new Error('something went wrong'))
})


// reset password 
export const resetPassword = asyncHandler(async (req, res, next)=>{
  // check user 
  let user = await User.findOne({ forgetCode: req.body.forgetCode })
  if(!user) return next(new Error("Invalid Code"))

  user = await User.findOneAndUpdate({ forgetCode: req.body.forgetCode }, { $unset: { forgetCode: 1},
  $set: { password: bcryptjs.hashSync(req.body.password, Number(process.env.SALT_ROUND)
  )}
})


  // invalidate tokens
  const tokens = await Token.find({ user: user._id})

  tokens.forEach(async (token) => {
    token.isValid = false
    await token.save()
  })

  // send response
  return res.json({ success: true, message: "Try to login"})
})