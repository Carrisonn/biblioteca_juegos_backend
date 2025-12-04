import { DataTypes } from 'sequelize'
import { DB } from '../config/DB.js'

export const GameModel = DB.define('games', {
  game: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING }
})