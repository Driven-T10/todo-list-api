import { Router } from "express"
import authRouter from "./auth.routes.js"
import taskRouter from "./task.routes.js"

const router = Router()
router.use(authRouter)
router.use(taskRouter)

export default router