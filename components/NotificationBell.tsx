'use client';

import { useState, useEffect } from 'react';
import { notificationApi } from '@/lib/api';
import { Notification } from '@/lib/types';
import { Bell, X, Check } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const response = await notificationApi.getMyNotifications();
    if (response.success && response.data) {
      setNotifications(response.data);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationApi.markAsRead(notificationId);
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    await notificationApi.markAllAsRead();
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setLoading(false);
  };

  const handleDelete = async (notificationId: string) => {
    await notificationApi.delete(notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tournament_invite':
        return '🏆';
      case 'team_approved':
        return '✅';
      case 'room_details':
        return '🎮';
      case 'organizer_status':
        return '👑';
      case 'tower_invite':
        return '🏰';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-[#1A1A1A] rounded-lg transition"
      >
        <Bell className="w-6 h-6 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF1A1A] text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-sm text-[#FF1A1A] hover:underline disabled:opacity-50"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-800 hover:bg-[#0D0D0D] transition ${
                      !notification.isRead ? 'bg-[#FF1A1A]/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 hover:bg-[#2A2A2A] rounded transition"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 hover:bg-[#2A2A2A] rounded transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
