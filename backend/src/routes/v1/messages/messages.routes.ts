import express from 'express';

import sql from '../../../db/db.config';

const router = express.Router();

router.get('/messages', async (req: any, res) => {
  try {
    if (
      req.query.id === undefined ||
      req.query.id === 'undefined' ||
      req.query.id === null ||
      isNaN(req.query.id)
    ) {
      return res.json([]);
    }

    const incomingDiscussion = await sql`
        select * from discussions where id = ${req.query.id}
    `;

    if (incomingDiscussion.length === 0) {
      return res.status(404).send("there's no discussion");
    }

    if (
      req.user.id === incomingDiscussion[0].user1 ||
      req.user.id === incomingDiscussion[0].user2
    ) {
      const messages = await sql`
        select * from messages where discussion_id = ${incomingDiscussion[0].id}
    `;

      res.json(messages);
    } else {
      return res.status(400).send("You don't have access to this discussion");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/messages', async (req: any, res) => {
  try {
    const { discussion_id, text_body } = req.body;

    console.log({ body: req.body, user: req.user });

    await sql`
      insert into messages (
        sender_id, discussion_id, text_body
      ) values (
        ${req.user.id}, ${discussion_id}, ${text_body}
      )
    `;

    res.status(200).send('message created');
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

export default router;
