import { getAuth } from 'firebase-admin/auth';
import sql from '../db/db.config';

import server from './http.server';

import WebSocket from 'ws';

const wss = new WebSocket.Server({ server });

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ key: 'ping' }));
    }
  });
}, 5000);

wss.on('connection', (client: any) => {
  client.on('message', async (message: any) => {
    try {
      const checkUser = JSON.parse(message.toString());

      if (checkUser.key === 'authToken') {
        try {
          const decodedToken = await getAuth().verifyIdToken(checkUser.token);

          const user = await sql`
                  select * from users where user_id = ${decodedToken.uid}
              `;

          if (user.length !== 0) {
            client.user_id = user[0].id;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      client.send(JSON.stringify({ error: error }));
    }
  });
});

export default wss;
