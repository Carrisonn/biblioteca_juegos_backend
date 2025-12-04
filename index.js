import express from 'express'
import { router } from './routes/router.js'
import { DB } from './config/DB.js'

const app = express()

DB.authenticate()
  .then(() => console.log('Base de datos conectada'))
  .catch((error) => console.log('Error al conectar la base de datos: ', error))

const PORT = process.env.PORT ?? 8080

app.use(express.json())

app.disable('x-powered-by')

app.use('/', router)

app.listen(PORT)