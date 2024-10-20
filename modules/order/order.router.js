import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js"
import { isValid } from "../../middleware/validation.middleware.js"
import { createOrderSchema } from "./order.validation.js"
import { createOrder } from "./order.controller.js"
const router = Router()

// create order
router.post("/", isAuthenticated, isValid(createOrderSchema), createOrder)

export default router