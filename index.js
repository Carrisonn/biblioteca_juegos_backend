import express from 'express'
import cors from 'cors'
import { router } from './routes/router.js'
import { DB } from './config/DB.js'

const app = express()

DB.authenticate()
  .then(() => console.log('Base de datos conectada'))
  .catch((error) => console.log('Error al conectar la base de datos: ', error))

const acceptedDomains = ['http://localhost:5173', 'https://biblioteca-juegos-carrison.netlify.app']

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || acceptedDomains.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  }
}

app.use(cors(corsOptions))

const PORT = process.env.PORT ?? 8080

app.use(express.json())

app.disable('x-powered-by')

app.use('/api', router)

app.listen(PORT)