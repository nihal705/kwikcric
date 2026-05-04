import { Router } from 'express';

const router = Router();

router.get('/records', (req, res) => {
  res.json({ 
    success: true, 
    data: {
      mostRuns: { player: 'Sachin Tendulkar', value: 18426 },
      mostWickets: { player: 'Muttiah Muralitharan', value: 534 },
    }
  });
});

export default router;