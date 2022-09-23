import express from 'express';
import bodyParser from 'body-parser';
import Generics from './controllers/Generics.js';
import { Types, Utils } from '@ikomida/shared-backend';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let { name } = require('../package.json');
name = name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m: string) => m.toUpperCase())
  .replace(/-\w/g, (m: string[]) => m[1].toUpperCase());
const logger = Utils.Logger.getInstance(name);

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '10mb' }));
Utils.System.setExpressResponse(app);
const port = process?.env?.PORT || 80;
const generics = new Generics(logger);

app.get('/term/:type', async (req, res) => {
  const payload = await generics.getTerm(Types.Types.TTerm.valueOf(String(req.params?.type)));
  res.sendResponse(payload);
});

app.get('/termID/:type', async (req, res) => {
  const payload = await generics.getLastTerm(Types.Types.TTerm.valueOf(String(req.params?.type)));
  res.sendResponse(payload);
});

app.get('/cep/:cep', async (req, res) => {
  const payload = await generics.getAddressByCep(req.params.cep);
  res.sendResponse(payload);
});

app.all('/', async (req, res) => {
  res.sendResponse({});
});

app.all('*', async (req, res) => {
  logger.error(`Generics endpoint "${req?.url}" not found:`);
  res.status(404).sendResponse({ error: 'NOT FOUND' });
});

app.listen(port, () => {
  logger.info(`${name} listening at http://localhost:${port}`);
});
