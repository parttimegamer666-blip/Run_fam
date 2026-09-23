import React from 'react';
import { X, Bell, Trophy, Users, MapPin, Heart, Flame, ShieldAlert } from 'lucide-react';
import { NotificationItem } from '../../types';
import { db } from '../../services/db';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNotificationRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationRead,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (n: NotificationItem) => {
    db.markNotificationAsRead(n.id);
    onNotificationRead();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'club':
        return <Users className="w-4 h-4 text-[#529d00]" />;
      case 'city':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'kudos':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'moderation':
        return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[80vh] flex flex-col text-xs">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-900" />
            <h3 className="font-display font-black text-base text-slate-900">
              Notifications
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 py-2 space-y-1">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3 rounded-2xl transition-colors cursor-pointer flex items-start gap-3 ${
                  n.read ? 'bg-white opacity-70' : 'bg-slate-50 font-medium'
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-slate-900 text-xs truncate">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#72D600] shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No notifications yet.</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
