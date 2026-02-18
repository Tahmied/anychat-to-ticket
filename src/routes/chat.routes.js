import { Router } from 'express'
import { chatStart } from '../Controllers/chat.controller.js'


const router = Router()

router.post('/text', chatStart)

export default router   