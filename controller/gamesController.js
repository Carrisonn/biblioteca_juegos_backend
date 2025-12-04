import { Op } from 'sequelize'
import { GameModel } from '../model/GameModel.js'

export async function getGames(req, res) {
  try {
    const games = await GameModel.findAll()
    res.status(200).json({ games })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: 'Error interno del servidor' })
  }
}

export async function searchGame(req, res) {
  try {
    const { game } = req.params
    if (!game) return res.status(400).json({ errorMessage: 'Faltan datos en el formulario' })
    const games = await GameModel.findAll({ where: { game: { [Op.like]: `%${game}%` } } })
    if (!games.length) return res.status(404).json({ errorMessage: `El juego "${game}" no existe` })
    res.status(200).json({ games })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: 'Error interno del servidor' })
  }
}

export async function createGame(req, res) {
  try {
    const { game, state } = req.body
    if (!game || !state) return res.status(400).json({ errorMessage: 'Faltan datos en el formulario' })
    const gameExist = await GameModel.findOne({ where: { game } })
    if (gameExist) return res.status(409).json({ errorMessage: `El juego "${game}" ya esta en la lista` })
    const newGame = await GameModel.create({ game, state })
    res.status(200).json({ newGame, successMessage: `${game} agregado a la lista 🎉` })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: 'Error interno del servidor' })
  }
}

export async function deleteGame(req, res) {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ errorMessage: 'Falta el ID para borrar el juego' })
    const gameToDelete = await GameModel.findByPk(id)
    if (!gameToDelete) return res.status(404).json({ errorMessage: 'No se ha podido borrar el juego o ya ha sido borrado' })
    await gameToDelete.destroy()
    res.status(200).json({ gameToDelete, successMessage: 'Juego borrado de la lista' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: 'Error interno del servidor' })
  }
}

export async function editGame(req, res) {
  try {
    const { id, game, state } = req.body
    if (!id || !game || !state) return res.status(400).json({ errorMessage: 'Faltan datos en el formulario' })
    const [affectedRows] = await GameModel.update({ game, state }, { where: { id } })
    if (!affectedRows) return res.status(404).json({ errorMessage: 'Hubo un problema al guardar cambios' })
    const updatedGame = await GameModel.findOne({ where: { id } })
    res.status(200).json({ updatedGame, successMessage: 'Juego actualizado 🎉' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ errorMessage: 'Error interno del servidor' })
  }
}
