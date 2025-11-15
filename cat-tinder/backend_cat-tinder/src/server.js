import express from 'express';
import { connectDB } from './config/db.js';
import swipesRoutes from './routes/swipes.routes.js';
import matchesRoutes from './routes/matches.routes.js';
import catsRoutes from './routes/cats.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'API is running ' });
});

// API Routes
app.use('/api/cats', catsRoutes);
app.use('/api/swipes', swipesRoutes);
app.use('/api/matches', matchesRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cat_tinder';

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(` API is running on http://localhost:${PORT}`);
  });
});
