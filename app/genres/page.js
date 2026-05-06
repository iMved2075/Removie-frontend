"use client";
import React, { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { FaMasksTheater } from "react-icons/fa6";

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/genres");
      if (!response.ok) throw new Error("Failed to fetch genres");
      const data = await response.json();
      setGenres(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load genres. Make sure the backend is running.");
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genre) => {
    setLoading(true);
    setSelectedGenre(genre);
    try {
      const response = await fetch("http://localhost:5000/api/movies/genre?limit=20&enrich=posters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genre }),
      });

      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError("Failed to load movies for this genre.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchGenres();
    };

    load();
  }, []);

  if (loading && !genres.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
          <p className="mt-4 text-gray-400">Loading genres...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-linear-to-b from-gray-900 via-gray-900 to-black">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 m-4 rounded-lg">
          {error}
        </div>
      )}

      <section className="px-6 py-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FaMasksTheater size={32} className="text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
              Genres
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Pick a vibe and dive in. Each genre opens a curated slice of the catalog.
          </p>
        </div>

        {!selectedGenre ? (
          // Genre Selection Grid
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => fetchMoviesByGenre(genre)}
                className="group relative p-6 rounded-xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative">
                  <h3 className="font-bold text-white text-center line-clamp-2">{genre}</h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Movies in Selected Genre
          <div>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setMovies([]);
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                ← Back to Genres
              </button>
              <h2 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                {selectedGenre}
              </h2>
              <span className="ml-auto text-gray-400 text-sm">
                {movies.length} movies found
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
                <p className="mt-4 text-gray-400">Loading movies...</p>
              </div>
            ) : movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.map((movie, idx) => (
                  <MovieCard key={idx} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No movies found in this genre</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default GenresPage;

