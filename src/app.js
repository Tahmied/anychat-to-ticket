import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
const app = express()

app.use(cors({origin: 'http://localhost:3000', 
  credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('public'))

// routes
import installationRoutes from './routes/installation.routes.js'

app.use('/api/v1/insatllation', installationRoutes)

export { app }
