import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { folderRoutes } from './routes/folderRoutes';

const app = new Elysia()
  .use(cors())
  .use(folderRoutes)
  .listen(process.env.PORT || 3000, () => {
    console.log(`🦊 Elysia is running at http://localhost:${process.env.PORT || 3000}`);
  });

export type App = typeof app;