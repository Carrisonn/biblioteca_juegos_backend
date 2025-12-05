import { Router } from 'express'
import { getGames, searchGame, createGame, deleteGame, editGame } from '../controller/gamesController.js'

export const router = Router()

router.get('/games', getGames)
router.get('/search/:game', searchGame)
router.post('/create', createGame)
router.delete('/delete/:id', deleteGame)
router.put('/edit', editGame)