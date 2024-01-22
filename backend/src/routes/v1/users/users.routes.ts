import express from 'express';

import sql from '../../../db/db.config';

const router = express.Router();

router.get('/me', (req: any, res) => {
  try {
    if (!req.user) {
      return res.send(null);
    }
    res.send(req.user);
  } catch (error) {
    console.log(error);
  }
});

router.put('/me', async (req: any, res) => {
  try {
    if (req.user) {
      await sql`update users set username = ${req.body.username} where user_id = ${req.user.user_id}`;

      res.status(200).send('Username set successfully');
    } else {
      res.send('User not found, or non authenticated');
    }
  } catch (error) {
    console.log(error);
    throw new Error('User not found, or non authenticated');
  }
});

router.get('/users', async (req: any, res) => {
  try {
    const usersList = await sql`
      select * from users
    `;

    res.json(usersList);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

export default router;
