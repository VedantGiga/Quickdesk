import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const NotificationStatus: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'email_queue'),
      where('to', '==', user.email),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: any) => !n.sent).length);
    });

    return unsubscribe;
  }, [user]);

  if (!user || notifications.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
        <span className="text-sm text-blue-700">📧</span>
        <span className="text-sm text-blue-700">
          {unreadCount > 0 ? `${unreadCount} pending notifications` : 'All notifications sent'}
        </span>
      </div>
      
      {notifications.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-y-auto">
          <div className="p-3 border-b">
            <h3 className="font-semibold text-gray-900">Recent Notifications</h3>
          </div>
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-3 border-b last:border-b-0 ${!notif.sent ? 'bg-blue-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notif.subject}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.body.substring(0, 100)}...</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.createdAt.toDate()).toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  notif.sent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {notif.sent ? 'Sent' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationStatus;