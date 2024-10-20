import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js"
import { isAuthorized } from "./../../middleware/authorization.middleware.js"
import { fileUpload, filterObject } from "../../utils/multer.js"
import { createProductSchema, productIdSchema } from "./product.validation.js"
import { addProduct, deleteProduct, allProducts, singleProduct } from "./product.controller.js"
import { isValid } from "../../middleware/validation.middleware.js";
const router = Router({ mergeParams: true})

// crud

// create product
router.post("/", isAuthenticated, isAuthorized("admin"), fileUpload(filterObject.image).fields([
  { name: "defaultImage", maxCount: 1},
  {name: "subImages", maxCount: 4}
]),
isValid(createProductSchema), addProduct
)

// delete product
router.delete("/:productId",
   isAuthenticated,
    isAuthorized("admin"),
     isValid(productIdSchema),
      deleteProduct)


  // get all products + get the products of certain category
  // router.get("/category/:categoryId/products, allProducts")

  router.get("/", allProducts)


  // single product
  router.get("/single/:productId", isValid(productIdSchema), singleProduct)

export default router