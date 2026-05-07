"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { API_BASE_URL } from "@/lib/api";

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = params?.id;
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!movieId) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE_URL}/api/movies/id/${movieId}`);
        if (!response.ok) throw new Error("Failed to load movie");
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
          setMovie(data[0]);
        } else {
          setError("Movie not found.");
        }
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [movieId]);

  useEffect(() => {
    if (!movie?.title) return;
    const loadRecs = async () => {
      setRecLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_title: movie.title, limit: 6 }),
        });
        if (!response.ok) return;
        const data = await response.json();
        const titles = data.recommended_movies || [];
        const detailResponses = await Promise.all(
          titles.map((title) =>
            fetch(
              `${API_BASE_URL}/api/movies/movie-details?title=${encodeURIComponent(title)}`
            ).then((res) => (res.ok ? res.json() : []))
          )
        );
        const recMovies = detailResponses
          .map((payload) => (Array.isArray(payload) ? payload[0] : null))
          .filter(Boolean);
        setRecommendations(recMovies);
      } catch (err) {
        // Ignore recommendation errors.
      } finally {
        setRecLoading(false);
      }
    };

    loadRecs();
  }, [movie]);

  if (loading) {
    return (
      <main className="flex-1 bg-linear-to-b from-gray-900 via-gray-900 to-black">
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="h-6 w-40 bg-gray-800/80 rounded-full animate-pulse mb-6" />
          <div className="grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="h-96 rounded-2xl bg-gray-800/80 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-800/80 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-linear-to-b from-gray-900 via-gray-900 to-black">
        <section className="px-6 py-16 max-w-6xl mx-auto text-gray-300">
          {error}
        </section>
      </main>
    );
  }

  if (!movie) return null;

  return (
    <main className="flex-1 bg-linear-to-b from-gray-900 via-gray-900 to-black">
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <div>
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={`${movie.title} poster`}
                className="w-full rounded-2xl shadow-xl"
              />
            ) : (
              <div className="h-96 rounded-2xl bg-gray-800" />
            )}
          </div>
          <div className="text-gray-300">
            <h1 className="text-4xl font-black text-white mb-2">{movie.title}</h1>
            {movie.tagline ? (
              <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
            ) : null}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
              <div>
                <p className="text-gray-500 text-xs uppercase">Year</p>
                <p>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Rating</p>
                <p>⭐ {(movie.weighted_rating || movie.vote_average || 0).toFixed(1)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Runtime</p>
                <p>{movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Genre</p>
                <p>{movie.genres || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Language</p>
                <p>{movie.language || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase mb-2">Overview</p>
              <p className="leading-relaxed">{movie.overview || "No description available"}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended Movies</h2>
          {recLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 rounded-lg bg-gray-800/80 animate-pulse" />
              ))}
            </div>
          ) : recommendations.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((recMovie, idx) => (
                <MovieCard key={idx} movie={recMovie} compact />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recommendations available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
