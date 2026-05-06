"use client";
import React, { useState } from "react";
import { FaRegBell } from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "recommendation",
      title: "New Recommendation",
      message: "Based on your search, we found similar movies you might like",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "new-release",
      title: "New Release",
      message: "Check out the latest movies in your favorite genre",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "trending",
      title: "Trending Now",
      message: "These movies are trending this week in the community",
      time: "1 day ago",
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "recommendation":
        return "🎬";
      case "new-release":
        return "⭐";
      case "trending":
        return "🔥";
      default:
        return "📌";
    }
  };

  return (
    <main className="flex-1 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <section className="px-6 py-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FaRegBell size={32} className="text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
              Notifications
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Stay updated with new releases, recommendations, and trending movies
          </p>
        </div>

        {/* Controls */}
        {notifications.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-400 text-sm">
              {notifications.filter((n) => !n.read).length} unread notifications
            </div>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  notif.read
                    ? "bg-gray-900/50 border-gray-700 opacity-75"
                    : "bg-gray-800 border-cyan-500/50 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl mt-1">{getIcon(notif.type)}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{notif.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
                    <p className="text-gray-500 text-xs">{notif.time}</p>
                  </div>

                  {/* Action */}
                  {!notif.read && (
                    <button className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-xs font-medium transition-colors">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
            <p className="text-gray-400">
              You're all caught up! Check back later for new recommendations and updates.
            </p>
          </div>
        )}

        {/* Settings Info */}
        <div className="mt-12 p-6 rounded-xl bg-gray-800/50 border border-gray-700">
          <h3 className="font-bold text-white mb-3">Notification Preferences</h3>
          <p className="text-gray-400 text-sm mb-4">
            Customize what notifications you'd like to receive
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-300 text-sm">Recommendations based on your watches</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-300 text-sm">New releases in your favorite genres</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-300 text-sm">Trending movies this week</span>
            </label>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotificationsPage;
