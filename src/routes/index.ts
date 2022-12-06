import express, { Request, Response } from 'express';
import { resize } from './api/resize';

const routes = express.Router();
routes.get('/', (req: Request, res: Response) => {
  res.send('main route');
});

routes.use('/images', resize);

export default routes;
