import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Modal from "./Modal";
import MovieCard from "./MovieCard";
import { MdOutlineClose } from "react-icons/md";
import { API_BASE_URL } from "@/lib/api";

const MovieSearch = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const abortRef = useRef(null);
  const pendingCloseRef = useRef(false);
  const lastPathRef = useRef("");
  const pathname = usePathname();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      pendingCloseRef.current = false;
      lastPathRef.current = pathname;
      return;
    }
    if (pendingCloseRef.current && lastPathRef.current && lastPathRef.current !== pathname) {
      pendingCloseRef.current = false;
      onClose();
    }
    lastPathRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  const handleSearch = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setError("");
      return;
    }

    if (!isOnline) {
      setError("You appear to be offline. Check your connection and try again.");
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(
        `${API_BASE_URL}/api/movies/search?limit=30&enrich=posters`,
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal,
      }
      );

      if (response.status === 429) {
        let retryAfter = "Please wait and try again.";
        try {
          const data = await response.json();
          if (data && data.retry_after) {
            retryAfter = `Try again in ${data.retry_after}s.`;
          }
        } catch (parseError) {
          // Ignore parse errors for rate-limit responses.
        }
        setSearchResults([]);
        setError(`Too many searches in a short time. ${retryAfter}`);
        return;
      }

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError("Failed to fetch search results. Please try again shortly.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, isOnline, handleSearch]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search the Library">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find films by title. Press Enter to search.
          </p>
          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
              placeholder="Type movie name..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50"
              disabled={loading || !isOnline}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Searching...</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-56 rounded-lg bg-gray-200/60 dark:bg-gray-800 animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!loading && searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {searchResults.length} movie(s)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {searchResults.slice(0, 9).map((movie, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      pendingCloseRef.current = true;
                    }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && searchResults.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No matches for {searchTerm}</p>
              <p className="text-sm mt-2">Try a different title or check spelling</p>
            </div>
          )}

          {!loading && searchResults.length === 0 && !searchTerm && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Start typing to explore titles</p>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};

export default MovieSearch;

