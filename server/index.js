import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';

dotenv.config()

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI
const app = express()

app.use(express.json())
app.use(cors({
  origin: "*",
  credentials: true
}))


mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connected')
    console.log('Using DB:', mongoose.connection.name)
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API running')
})

app.use('/movies', movieRoutes)
app.use('/movies', geminiRoutes)

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
