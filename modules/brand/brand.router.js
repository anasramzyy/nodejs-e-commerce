import { Router } from "express";
import { isValid } from "./../../middleware/validation.middleware.js"
import { createBrandSchema, updateBrandSchema, deleteBrandSchema } from "./brand.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js"
import { isAuthorized } from "../../middleware/authorization.middleware.js"
import { fileUpload ,filterObject } from "../../utils/multer.js"
import { createBrand, updateBrand, deleteBrand, allBrands } from "./brand.controller.js"
const router = Router()

// CRUD 
// create brand
router.post("/", isAuthenticated, isAuthorized("admin"), fileUpload(filterObject.image).single("brand"), isValid(createBrandSchema), createBrand)


// update brand
router.patch("/:brandId", isAuthenticated, isAuthorized("admin"), fileUpload(filterObject.image).single("brand"), isValid(updateBrandSchema), updateBrand)

// delete brand
router.delete("/:brandId", isAuthenticated, isAuthorized("admin"), isValid(deleteBrandSchema), deleteBrand)

// get brands
router.get("/", allBrands)


export default router