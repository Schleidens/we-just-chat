import express from 'express';

import sql from '../../../db/db.config';

const router = express.Router();

export interface Users {
  id: number;
  username: string | null;
  user_id: string;
}

interface Discussions {
  id: number;
  last_message: string;
  user1: number;
  user2: number;
  participants?: Users[];
}

router.get('/discussions', async (req: any, res) => {
  try {
    const discussions = await sql`
            select * from discussions where user1 = ${req.user.id} or user2 = ${req.user.id}
        `;

    if (discussions.length === 0) {
      return res.send([]);
    }

    const participantsId: number[] = [];

    discussions.forEach((discussion) => {
      participantsId.push(discussion.user1);
      participantsId.push(discussion.user2);
    });

    const participants = await sql`
        select * from users where id in ${sql(participantsId)}
    `;

    res.json(
      discussions.map((discussion) => {
        const participant1 = participants.find(
          (participant) => participant.id === discussion.user1,
        );

        const participant2 = participants.find(
          (participant) => participant.id === discussion.user2,
        );

        return { ...discussion, participants: [participant1, participant2] };
      }),
    );
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

router.post('/discussions', async (req: any, res) => {
  const { user1, user2 } = req.body;

  try {
    const isDiscussionExist: Discussions[] = await sql`
        select * from discussions where (user1 = ${user1} and user2 = ${user2}) or (user1 = ${user2} AND user2 = ${user1})
      `;

    const setParticipantsInDiscussion = async (discussions: Discussions[]) => {
      if (discussions.length !== 0) {
        const participantsId: number[] = [];

        discussions.forEach((discussion) => {
          participantsId.push(discussion.user1);
          participantsId.push(discussion.user2);
        });

        const participants = await sql`
            select * from users where id in ${sql(participantsId)}
          `;

        const discussionsWithParticipants = discussions.map((discussion) => {
          const participant1 = participants.find(
            (participant) => participant.id === discussion.user1,
          );

          const participant2 = participants.find(
            (participant) => participant.id === discussion.user2,
          );

          return { ...discussion, participants: [participant1, participant2] };
        });

        return discussionsWithParticipants.length !== 0
          ? discussionsWithParticipants[0]
          : [];
      }

      return [];
    };

    if (isDiscussionExist.length === 0) {
      const newDiscussion: Discussions[] = await sql`
          insert into discussions (user1, user2)
          values (${user1}, ${user2})
          returning *
        `;

      const discussionsWithParticipants = await setParticipantsInDiscussion(
        newDiscussion,
      );

      res.json(discussionsWithParticipants);
    } else {
      const discussionsWithParticipants = await setParticipantsInDiscussion(
        isDiscussionExist,
      );

      res.json(discussionsWithParticipants);
    }
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});

router.put('/discussions', async (req: any, res) => {
  try {
    if (
      req.query.id === undefined ||
      req.query.id === 'undefined' ||
      req.query.id === null ||
      isNaN(req.query.id)
    ) {
      return res.status(400).send("you don't have access to this discussion");
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
      await sql`
        update discussions set last_message = ${req.body.message} where id = ${req.query.id}
      `;

      res.status(200).send('discussion has been updated');
    } else {
      return res.status(400).send("You don't have access to this discussion");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

export default router;
