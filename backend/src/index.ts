import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import * as admin from 'firebase-admin';
import cors from 'cors';
import usersRoutes from './routes/v1/users/users.routes';
import discussionsRoutes from './routes/v1/messages/discussions.routes';
import messagesRoutes from './routes/v1/messages/messages.routes';

import { authMiddleware } from './middleware/auth';
import server from './server/http.server';
import App from './server/app';

const service_account = JSON.parse(process.env.SERVICE_ACCOUNT as string);

admin.initializeApp({ credential: admin.credential.cert(service_account) });

App.use(express.json());

App.use(
  cors({
    origin: [process.env.WEB_LINKS as string],
  }),
);

App.use(authMiddleware, usersRoutes);
App.use(authMiddleware, discussionsRoutes);
App.use(authMiddleware, messagesRoutes);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('server started on port : ' + port);
});
