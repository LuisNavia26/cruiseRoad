import express from 'express';

const router = express.Router();

router.post('/plan-trip', async (req, res) => {
  const { destination, start, vehicleType } = req.body;
  console.log("Received trip planning request:", { destination, start, vehicleType });
  res.json({ ok: true });
});

export default router;