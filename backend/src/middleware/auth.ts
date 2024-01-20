import { getAuth } from 'firebase-admin/auth';

import sql from '../db/db.config';

export const authMiddleware = async (req: any, res: any, next: any) => {
  const [mode, token] = req.headers['authorization']?.split(' ') ?? [];
  console.log({ mode });
  try {
    const decodedToken = await getAuth().verifyIdToken(token);

    let user = await sql`
        select * from users where user_id = ${decodedToken.uid}
    `;

    if (user.length === 0) {
      await sql`
      insert into users
        (user_id)
      values
        (${decodedToken.uid})
    `;
      user = await sql`
        select * from users where user_id = ${decodedToken.uid}
    `;

      if (user.length === 0)
        throw new Error('User not found, or non authenticated');
    }

    req.user = user[0];

    next();
  } catch (e) {
    console.log(e);

    res.status(403).send('Unauthorized request');
  }
};
