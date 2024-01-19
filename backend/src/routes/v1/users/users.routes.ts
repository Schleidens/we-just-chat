import express from 'express';

const router = express.Router();

router.get('me', (req: any, res) => {
  try {
    if (!req.user) {
      return res.send(null);
    }
    res.send('ok');
  } catch (error) {
    console.log(error);
  }
});

export default router;
