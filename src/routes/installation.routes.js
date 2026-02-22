import { Router } from 'express'
import { getChat } from '../controllers/installation.controller.js'


const router = Router()

router.post('/getChat', getChat)

export default router   