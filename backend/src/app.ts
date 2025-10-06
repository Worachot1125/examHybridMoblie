import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { env } from './config/env.js';
import users from './routes/user.route.js';
import { errorHandler } from './middleware/errorHandler.js';
import auth from './routes/auth.route.js';


export function createApp() {
const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));


app.get('/health', (_req, res) => res.json({ ok: true, status: 'healthy' }));
app.use('/api/users', users);
app.use('/api/auth', auth);


app.use(errorHandler);
return app;
}