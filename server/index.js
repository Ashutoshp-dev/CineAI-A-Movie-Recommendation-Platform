import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url'
import tmdbRoutes from './routes/tmdbRoutes.js';

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


app.use(express.json())

const allowedOrigins = [
  'http://localhost:5173', // Dev
  'http://localhost:3000', // Dev
  'https://cineai-a-movie-recommendation-platform.onrender.com' // Prod
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connected')
    console.log('Using DB:', mongoose.connection.name)
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// app.get('/', (req, res) => {
//   res.send('API running')
// })

app.use('/movies', movieRoutes)
app.use('/recommend', geminiRoutes)
app.use('/tmdb', tmdbRoutes);

const userData = new Map();

// GET /user/:id
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const avatar = userData.get(userId);
  res.json({ avatar: avatar || null });
});

// PATCH /user/set-avatar/:id
app.patch("/user/set-avatar/:id", (req, res) => {
  const userId = req.params.id;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).json({ error: "Avatar is required" });
  }

  userData.set(userId, avatar);
  res.json({ message: "Avatar updated successfully" });
});

app.use(express.static(join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
