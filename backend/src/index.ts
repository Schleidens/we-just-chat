import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as admin from 'firebase-admin';

import { authMiddleware } from './middleware/auth';

const service_account = JSON.parse(process.env.SERVICE_ACCOUNT as string);

admin.initializeApp({ credential: admin.credential.cert(service_account) });

const App = express();

App.use(express.json());

App.get('/foo', authMiddleware, (req, res) => {
  res.send('ok');
});

App.post('/foo', (req, res) => {
  console.log(req.body);
  res.send('done');
});

App.listen(3000, () => {
  console.log('server started');
});
