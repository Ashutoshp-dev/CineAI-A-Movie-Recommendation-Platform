import express from 'express'
const router = express.Router()
import Movie from '../models/Movie.js'

//Get requests
router.get('/liked', async (req, res) => {
  try {
    const { uid } = req.query
    const likedMovies = await Movie.find({ uid, isLiked: true })
    console.log('🎬 Found Movies:', likedMovies, "found uid:", uid)
    res.json(likedMovies)
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})
router.get('/saved', async (req, res) => {
  try {
    const { uid } = req.query;
    const savedMovies = await Movie.find({ uid, isSaved: true })
    res.json(savedMovies)
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
})

//Post requests
router.post('/liked', async (req, res) => {
  try {
    const { uid, movie } = req.body;
    if (!movie.id || !movie.title) {
      return res.status(400).json({ message: "Movie id and title are required." });
    }
    const updated = await Movie.findOneAndUpdate(
      { uid, id: movie.id },
      { ...movie, uid, isLiked: true },
      { upsert: true, new: true }
    )
    res.status(201).json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
router.post('/saved', async (req, res) => {
  try {
    const { uid, movie } = req.body;
    if (!uid || !movie.id || !movie.title) {
      return res.status(400).json({ message: "Missing UID or Movie ID" });
    }
    const updated = await Movie.findOneAndUpdate(
      { uid, id: movie.id },
      { ...movie, uid, isSaved: true },
      { upsert: true, new: true }
    );
    res.status(201).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete requests
router.delete('/liked/:id', async (req, res) => {
  try {
    const { uid } = req.query;
    const movie = await Movie.findOneAndUpdate(
      { uid, id: req.params.id, isLiked: true },
      { isLiked: false },
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/saved/:id', async (req, res) => {
  try {
    const { uid } = req.query;
    const movie = await Movie.findOneAndUpdate(
      { uid, id: req.params.id, isSaved: true },
      { isSaved: false },
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router
