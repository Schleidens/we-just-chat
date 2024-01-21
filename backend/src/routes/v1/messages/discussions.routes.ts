import express from 'express';

import sql from '../../../db/db.config';

const router = express.Router();

router.get('/discussions', async (req: any, res) => {
  try {
    const discussions = await sql`
            select * from discussions where user1 = ${req.user.id} or user2 = ${req.user.id}
        `;

    if (discussions.length === 0) {
      return res.send([]);
    }

    console.log(discussions);

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

export default router;
