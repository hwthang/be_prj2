import express from"express"
import authController from "../controller/auth.controller.js"

const AuthRoute = express.Router()

AuthRoute.post("/login", authController.login)
AuthRoute.post("/register", authController.register)
AuthRoute.get("/chapters", authController.getChapters)

export default AuthRoute