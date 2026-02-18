import { Router } from 'express'
import { captureChat } from '../Controllers/chat.controller.js'


const router = Router()

router.post('/text', captureChat)

export default router