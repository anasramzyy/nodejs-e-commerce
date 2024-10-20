import { Router } from "express";
import { addToCart, userCart, updateCart, removeProductFromCart, clearCart } from "./cart.controller.js"
import { isAuthenticated } from "../../middleware/authentication.middleware.js"
import { isValid } from "../../middleware/validation.middleware.js"
import { cartSchema, removeProductFromCartSchema } from "./cart.validation.js"
const router = Router()

// CRUD
// create
router.post("/", isAuthenticated, isValid(cartSchema), addToCart)

// user cart
router.get("/", isAuthenticated, userCart)

// update cart
router.patch("", isAuthenticated, isValid(cartSchema), updateCart)


// clear cart
router.patch("/clear", isAuthenticated, clearCart)


// remove product from cart
router.patch("/:productId", isAuthenticated, isValid(removeProductFromCartSchema), removeProductFromCart)

export default router