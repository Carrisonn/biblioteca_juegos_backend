import express, { json } from 'express'
import cors from 'cors'
import { connectDB } from './config/DB.js'
import { router } from './routes/router.js'
import { corsOptions } from './config/cors.js'

const app = express()

const PORT = process.env.PORT ?? 8080

await connectDB()

app.use(cors(corsOptions))

app.use(json())

app.disable('x-powered-by')

app.use('/api', router)

app.listen(PORT)