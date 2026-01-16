import express from 'express'
import cors from 'cors'
import { router } from './routes/router.js'
import { DB } from './config/DB.js'
import { corsOptions } from './config/cors.js'

const app = express()

const PORT = process.env.PORT ?? 8080

await DB.authenticate()

app.use(cors(corsOptions))

app.use(express.json())

app.disable('x-powered-by')

app.use('/api', router)

app.listen(PORT)