import { Sequelize } from 'sequelize'
import { loadEnvFile } from 'node:process'

if (process.env.NODE_ENV !== 'production') {
  loadEnvFile()
}

export const DB = new Sequelize(process.env.DB_URI, {
  dialect: 'mysql',
  define: { timestamps: false },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

export async function connectDB(tries = 3) {
  try {
    await DB.authenticate()
    // await DB.sync()
  } catch (error) {
    if (tries <= 1) throw new Error('No se pudo iniciar la conexión con la base de datos')

    await new Promise(resolve => setTimeout(resolve, 3000))

    return connectDB(tries - 1)
  }
}