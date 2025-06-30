import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
     uid: { type: String, required: true},
    id: { type: Number, required: true},
    title: String,
    original_title: String,
    original_language: String,
    overview: String,
    release_date: String,
    genre_ids: [Number],
    adult: Boolean,
    backdrop_path: String,
    poster_path: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    video: Boolean,
    isLiked: {type:Boolean, default:false},
    isSaved: {type:Boolean, default:false}
}, { timestamps: true });

movieSchema.index({ uid: 1, id: 1 }, { unique: true });
const Movie = mongoose.model('Movie', movieSchema)

export default Movie;