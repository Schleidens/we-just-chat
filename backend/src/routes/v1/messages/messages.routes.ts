import express from 'express';

import sql from '../../../db/db.config';

import wss from '../../../server/ws.server';

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

    if (
      discussion_id === undefined ||
      discussion_id === 'undefined' ||
      discussion_id === null ||
      isNaN(discussion_id)
    ) {
      return res.json([]);
    }

    const incomingDiscussion = await sql`
        select * from discussions where id = ${discussion_id}
    `;

    if (incomingDiscussion.length === 0) {
      return res.status(404).send("there's no discussion");
    }

    if (
      req.user.id === incomingDiscussion[0].user1 ||
      req.user.id === incomingDiscussion[0].user2
    ) {
      const lastMessage = await sql`
      insert into messages (
        sender_id, discussion_id, text_body
      ) values (
        ${req.user.id}, ${discussion_id}, ${text_body}
      )
      returning *
    `;

      wss.clients.forEach((client: any) => {
        if (
          (client.user_id === incomingDiscussion[0].user1 ||
            client.user_id === incomingDiscussion[0].user2) &&
          client.readyState === client.OPEN
        ) {
          client.send(
            JSON.stringify({ key: 'new-message', message: lastMessage[0] }),
          );
        } else {
          return;
        }
      });

      await sql`
        update discussions set last_message = ${lastMessage[0].text_body} where id = ${discussion_id}
      `;

      res.status(200).send({ message: 'message created' });
    } else {
      return res.status(400).send("You don't have access to this discussion");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

export default router;
