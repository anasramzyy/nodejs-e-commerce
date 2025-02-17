import joi from "joi" 

// create order schema
export const createOrderSchema = joi.object(
  {
    address: joi.string().min(10).required(),
    coupon: joi.string().length(5),
    phone: joi.string().length(11).required(),
    payment: joi.string().valid("cash", "visa").required(),
  }
).required()