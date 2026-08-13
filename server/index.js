import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './src/db.js';
import travelersRouter from './src/routes/travelers.js';
import recommendationsRouter from './src/routes/recommendations.js';
import hotelsRouter from './src/routes/hotels.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://traveldna-server-production.up.railway.app',
    /\.vercel\.app$/
  ],
  credentials: true,
}));
app.use(express.json());

testConnection();

app.use('/api/travelers', travelersRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/hotels', hotelsRouter);

app.get('/', (req, res) => {
  res.json({ status: 'TravelDNA API running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});