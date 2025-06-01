import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogrouter } from './routes/blog';
import { uploadRouter } from './routes/upload';
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
      DATABASE_URL: string,
      JWT_TOKEN: string,
  };
}>();

// Configure CORS
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogrouter);
app.route('/api/v1/upload', uploadRouter);

export default app
