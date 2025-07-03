import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchFromTMDB = async (endpoint, res) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("TMDB fetch error:", error);
    res.status(500).json({ error: "Failed to fetch from TMDB" });
  }
};

//  Popular Movies
router.get("/popular", (req, res) => {
  const page = req.query.page || 1;
  fetchFromTMDB(`/movie/popular?page=${page}`, res);
});

//  Top Rated Movies
router.get("/toprated", (req, res) => {
  const page = req.query.page || 1;
  fetchFromTMDB(`/movie/top_rated?page=${page}`, res);
});

//  Trending Movies
router.get("/trending", (req, res) => {
  fetchFromTMDB(`/trending/movie/week?`, res);
});

//  Indian Movies
router.get("/indian", (req, res) => {
  const page = req.query.page || 1;
  fetchFromTMDB(`/discover/movie?with_original_language=hi&sort_by=popularity.desc&page=${page}`,res);
});

//  Recent Releases
router.get("/recent", (req, res) => {
  const start = "2025-04-03";
  const end = "2025-07-02";
  fetchFromTMDB(`/discover/movie?primary_release_date.gte=${start}&primary_release_date.lte=${end}&sort_by=release_date.desc`,res);
});

//  TV Shows
router.get("/tv", (req, res) => {
  const page = req.query.page || 1;
  fetchFromTMDB(`/tv/popular?page=${page}`,res);
});

export default router;