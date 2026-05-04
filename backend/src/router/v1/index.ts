import { Router } from 'express';
import authRoutes from './auth';
import playerRoutes from './players';
import tournamentRoutes from './tournaments';
import gameRoutes from './games';
import statsRoutes from './stats';
import worldCupRoutes from './worldCup';

const router = Router();

router.use('/auth', authRoutes);
router.use('/players', playerRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/games', gameRoutes);
router.use('/stats', statsRoutes);
router.use('/world-cup', worldCupRoutes);

export default router;