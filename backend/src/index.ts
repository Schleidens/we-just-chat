import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
import usersRoutes from './routes/v1/users/users.routes';
import discussionsRoutes from './routes/v1/messages/discussions.routes';
import messagesRoutes from './routes/v1/messages/messages.routes';

import { authMiddleware } from './middleware/auth';

const service_account = JSON.parse(process.env.SERVICE_ACCOUNT as string);

admin.initializeApp({ credential: admin.credential.cert(service_account) });

const App = express();

App.use(express.json());

App.use(
  cors({
    origin: ['http://localhost:5175'],
  }),
);

App.get('/foo', authMiddleware, (req, res) => {
  res.send('ok');
});

App.post('/foo', (req, res) => {
  console.log(req.body);
  res.send('done');
});

App.use(authMiddleware, usersRoutes);
App.use(authMiddleware, discussionsRoutes);
App.use(authMiddleware, messagesRoutes);

App.listen(3000, () => {
  console.log('server started');
});
