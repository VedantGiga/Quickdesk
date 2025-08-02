import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import ThemeToggle from './ui/ThemeToggle';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    notifications: {
      email: true,
      push: true,
      ticketUpdates: true,
      replies: true
    }
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: profileData.displayName,
          updatedAt: new Date()
        });
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    try {
      const newNotifications = { ...profileData.notifications, [key]: value };
      setProfileData({ ...profileData, notifications: newNotifications });
      
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          notifications: newNotifications,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to update notifications:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-white">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Profile & Settings
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'notifications' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔔 Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'security' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔒 Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.email}</h3>
                  <p className="text-sm text-gray-600">Role: {user?.role}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.notifications.email}
                    onChange={(e) => handleNotificationUpdate('email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Ticket Updates</h3>
                  <p className="text-sm text-gray-600">Get notified when ticket status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.notifications.ticketUpdates}
                    onChange={(e) => handleNotificationUpdate('ticketUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Reply Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when someone replies to your tickets</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.notifications.replies}
                    onChange={(e) => handleNotificationUpdate('replies', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Password Management</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Password changes are managed through Firebase Authentication. 
                  Use the password reset feature if you need to change your password.
                </p>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Reset Password
                </button>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Account Information</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p><strong>Account ID:</strong> {user?.uid}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;