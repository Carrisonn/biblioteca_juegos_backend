import { Router } from 'express'
import { Controller } from '../controller/gamesController.js'

export const router = Router()

router.get('/games', Controller.getGames)
router.post('/games', Controller.createGame)
router.put('/games/:id', Controller.editGame)
router.delete('/games/:id', Controller.deleteGame)

router.get('/health', Controller.APIHealthCheck)