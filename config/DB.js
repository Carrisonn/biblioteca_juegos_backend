import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

export const DB = new Sequelize(process.env.DB_URI, {
  host: 'localhost',
  dialect: 'mysql',
  define: { timestamps: false },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})