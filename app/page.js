
"use client";
import React, { useState, useEffect, useRef } from "react";
import MovieCard from "@/components/MovieCard";
import { API_BASE_URL } from "@/lib/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies?limit=48&random=1&enrich=posters`
      );
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.slice(0, 12));
    } catch (err) {
      setError("Failed to load movies. Please try again shortly.");
      console.error(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const fetchTopRated = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/movies/top-rated?limit=6&enrich=posters`
      );
      if (!response.ok) throw new Error("Failed to fetch top rated");
      const data = await response.json();
      setTopRated(data);
    } catch (err) {
      setError((prev) => prev || "Failed to load top rated movies.");
      console.error(err);
    }
  };

  const isMounted = useRef(true);

  useEffect(() => {
    // avoid synchronous setState calls directly in the effect body
    const load = async () => {
      await fetchMovies();
      await fetchTopRated();
    };

    load();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <main className="flex-1 bg-linear-to-b from-gray-900 via-gray-900 to-black">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 m-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text mb-4">
            Discover Movies
          </h1>
          {loading ? (
            <div className="max-w-2xl space-y-3">
              <div className="h-4 w-11/12 rounded-full bg-gray-800/80 animate-pulse" />
              <div className="h-4 w-8/12 rounded-full bg-gray-800/80 animate-pulse" />
            </div>
          ) : (
            <p className="text-gray-400 text-lg max-w-2xl">
              Explore thousands of movies, get personalized recommendations, and find your next favorite film.
            </p>
          )}
        </div>

        {/* Top Rated Section */}
        {loading && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-linear-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                ⭐ Top Rated
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-80 rounded-lg bg-gray-800/80 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {!loading && topRated.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-linear-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                ⭐ Top Rated
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRated.map((movie, idx) => (
                <MovieCard key={idx} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Explore More Section */}
        {loading && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">More to Explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-80 rounded-lg bg-gray-800/80 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">More to Explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((movie, idx) => (
                <MovieCard key={idx} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
