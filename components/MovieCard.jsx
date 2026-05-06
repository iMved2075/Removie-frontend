"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";

const MovieCard = ({ movie, onMovieClick, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const rating = movie.weighted_rating || movie.vote_average || 0;
  const title = movie.title || "Unknown";
  const overview = movie.overview || "No description available";
  const releaseDate = movie.release_date || null;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const posterUrl = movie.poster_url || "";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (onMovieClick) return onMovieClick(movie);
        if (movie && movie.id) router.push(`/movie/${movie.id}`);
      }}
      className={`group relative ${compact ? "h-44" : "h-80"} rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      {/* Poster */}
      <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center relative">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${title} poster`}
            fill
            sizes={compact ? "(max-width: 768px) 50vw, 200px" : "(max-width: 768px) 50vw, 320px"}
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
        <div className={`relative text-center ${compact ? "px-3" : "px-4"}`}>
          <h3 className={`text-white font-bold ${compact ? "text-sm" : "text-lg"} line-clamp-2 ${compact ? "mb-1" : "mb-2"}`}>
            {title}
          </h3>
          <p className={`text-gray-300 ${compact ? "text-xs" : "text-sm"} ${compact ? "mb-1" : "mb-3"}`}>
            ({year})
          </p>
          <div className="flex items-center justify-center gap-1">
            <FaStar className="text-yellow-400" size={compact ? 12 : 16} />
            <span className={`text-yellow-400 font-semibold ${compact ? "text-xs" : "text-base"}`}>
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && !compact && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-all duration-300">
            <h3 className="text-white font-bold text-base mb-2 line-clamp-2 text-center">{title}</h3>
            <p className="text-gray-300 text-xs line-clamp-4 mb-3 text-center">{overview}</p>
            <button className="mt-auto px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
