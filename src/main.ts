import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.router';
import exploreRouter from './modules/explore/explore.router';
import playlistsRouter from './modules/playlists/playlists.router';
import favoritesRouter from './modules/favorites/favorites.router';
import { errorHandler } from './core/middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'BeatFlow API running successfully!' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/favorites', favoritesRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
