import { Op } from 'sequelize'
import { GameModel } from '../model/GameModel.js'

export async function getGames(req, res) {
  try {
    const [games, count] = await Promise.all([
      GameModel.findAll(),
      GameModel.count()
    ])

    res.status(200).json({ games, totalGames: count })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export async function searchGame(req, res) {
  const { game } = req.params
  if (!game) return res.status(400).json({ message: 'Faltan datos en el formulario' })

  try {
    const games = await GameModel.findAll({ where: { game: { [Op.like]: `%${game}%` } } })
    if (games.length === 0) return res.status(404).json({ message: `El juego "${game}" no existe` })

    res.status(200).json({ games })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export async function createGame(req, res) {
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

    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export async function deleteGame(req, res) {
  const { id } = req.params
  if (!id) return res.status(400).json({ message: 'Falta el ID para borrar el juego' })

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
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export async function editGame(req, res) {
  const { id } = req.params
  const { game, state } = req.body
  if (!id) return res.status(400).json({ message: 'Falta el ID para actualizar el juego' })
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
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export function APIHealthCheck(req, res) {
  try {
    res.status(200).send(`Todo OK desde hace ${Math.round(process.uptime())}s`)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
}