import { Router } from 'express'
import { getGames, searchGame, createGame, deleteGame, editGame } from '../controller/gamesController.js'

export const router = Router()

router.get('/games', getGames)
router.get('/games/:game', searchGame)
router.post('/games', createGame)
router.delete('/games/:id', deleteGame)
router.put('/games/:id', editGame)