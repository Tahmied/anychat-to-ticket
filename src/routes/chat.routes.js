import { Router } from 'express'
import { captureChat } from '../Controllers/chat.controller.js'


const router = Router()

router.get('/text', captureChat)

export default router