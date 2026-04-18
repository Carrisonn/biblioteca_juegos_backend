import { Op } from 'sequelize'
import { GameModel } from '../model/GameModel.js'

export class Controller {
  static async getGames(req, res) {
    const { search } = req.query

    try {
      const count = await GameModel.count()

      if (!search) {
        const games = await GameModel.findAll()
        return res.status(200).json({ games, totalGames: count })
      }

      const games = await GameModel.findAll({ where: { game: { [Op.like]: `%${search}%` } } })
      if (games.length === 0) return res.status(404).json({ message: `El juego "${search}" no existe` })

      res.status(200).json({ games, totalGames: count })
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  }

  static async createGame(req, res) {
    const { game, state } = req.body
    if (!game || !state) return res.status(400).json({ message: 'Faltan datos en el formulario' })

    try {
      const newGame = await GameModel.create({ game, state })
      const count = await GameModel.count()

      res.status(201).json({
        newGame,
        totalGames: count,
        message: `${game} agregado a la lista 🎉`
      })
    } catch (error) {
      console.log(error)

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: `El juego "${game}" ya esta en la lista` })
      }

      res.status(500)
    }
  }

  static async editGame(req, res) {
    const { id } = req.params
    const { game, state } = req.body
    if (!id) return res.status(400).json({ message: 'Falta el parámetro requerido en la ruta' })
    if (!game || !state) return res.status(400).json({ message: 'Faltan datos en el formulario' })

    try {
      const gameToUpdate = await GameModel.findByPk(id)
      if (!gameToUpdate) return res.status(404).json({ message: 'No se ha podido actualizar el juego o ya ha sido actualizado' })

      if (game) gameToUpdate.game = game
      if (state) gameToUpdate.state = state

      await gameToUpdate.save()

      res.status(200).json({
        updatedGame: gameToUpdate,
        message: `${game} ha sido actualizado 🎉`
      })
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  }

  static async deleteGame(req, res) {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Falta el parámetro requerido en la ruta' })

    try {
      const gameToDelete = await GameModel.findByPk(id)
      if (!gameToDelete) return res.status(404).json({ message: 'No se ha podido borrar el juego o ya ha sido borrado' })

      await gameToDelete.destroy()
      const count = await GameModel.count()

      res.status(200).json({
        deletedGame: gameToDelete,
        totalGames: count,
        message: `${gameToDelete.game} ha sido borrado`
      })
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  }

  static async APIHealthCheck(req, res) {
    const relativaTimeFormat = new Intl.RelativeTimeFormat('es', {
      numeric: 'auto',
      style: 'long'
    })

    const uptime = process.uptime()
    const now = new Date().getSeconds()

    const difSeconds = Math.round((uptime - now) / 1000)
    const difHours = Math.round(difSeconds / 3600)
    const APIUptime = relativaTimeFormat.format(difHours, 'hour')

    res.status(200).json({
      text: `Servicio en línea desde ${APIUptime}`,
      onLine: true
    })
  }
}