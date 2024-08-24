import express from 'express';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import socketIO from './services/socketIO';
import 'express-async-errors';
import { createCategories, createSymbolsTree } from './utils/createSymbolsTree';
import { symbolsArray } from './db/symbolsArray.json';
import symbolsObject from './db/symbolsObject.json';
import client from './services/redis';

dotenv.config();
const app = express();
app.use(express.json());

// Middleware to serve static files from 'icons' folder:
const iconsDir = path.join(__dirname, 'icons');
app.use('/icons', express.static(iconsDir));

// Fetch initial symbols structure
app.get('/static', (_req, res) => {
  const categories = createCategories(symbolsArray);
  const symbolsList = createSymbolsTree(symbolsArray);
  return res.send({ symbolsObject, symbolsList, categories });
});

// Update after user viewable symbols
app.post('/viewable', async (req, res) => {
  const viewableSymbols = req.body.viewableSymbols;
  const userId = req.body.userId;
  await client.set(userId, JSON.stringify(viewableSymbols));
  return res.send({});
});

// Fetch random icon
app.get('/random-icon', (req, res) => {
  fs.readdir(iconsDir, (error, files) => {
    if (error) return res.status(400).send(error);

    if (!files.length)
      return res.status(401).send({ message: 'Empty Directory' });

    const randomFile = files[Math.floor(Math.random() * files.length - 1)];
    res.sendFile(path.join(iconsDir, randomFile));
  });
});

const initServer = () => {
  const server = app.listen(3000, () => {
    console.log(`Server started on port ${process.env.PORT}`);
    socketIO.socketInit(server);
  });
};

initServer();
