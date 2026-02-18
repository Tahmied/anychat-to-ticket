import { Router } from 'express'
import { getChat } from '../Controllers/chat.controller.js'


const router = Router()

router.post('/getChat', getChat)

export default router   