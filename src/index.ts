import express from 'express';
import socketIO from './services/socketIO';
import 'express-async-errors';
import './services/redis';
import { createSymbolsTree } from './utils/createSymbolsTree';
import { symbols } from './db/symbolsArray.json';
import client from './services/redis';

const app = express();
app.use(express.json());

app.get('/', (_req, res, _next) => {
  // @ts-ignore
  const symbolTree = createSymbolsTree(symbols);
  return res.send(symbolTree);
});

app.post('/viewable', async (req, res) => {
  const viewableSymbols = req.body.viewableSymbols;
  const userId = req.body.userId;
  await client.set(userId, JSON.stringify(viewableSymbols));
  return res.send({});
});

app.get('/test2', async (req, res) => {
  const userId = req.body.userId;
  const ressult = await client.get(userId);
  return res.send({ account: ressult });
});

const initServer = () => {
  const server = app.listen(3000, () => {
    console.log(`Server started on port ${3000}`);
    socketIO.socketInit(server);
  });
};

initServer();
