import express from 'express';
import { resize } from './api/resize';

const routes = express.Router();
routes.get('/', (req, res) => {
  res.send('main route');
});

routes.use('/images', resize);

export default routes;
