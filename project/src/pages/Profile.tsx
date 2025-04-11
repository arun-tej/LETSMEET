import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Heart, MapPin, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  session: Session;
}

interface Profile {
  username: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  interests: string[];
  location: string;
}

export default function Profile({ session }: ProfileProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
    interests: [],
    location: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-rose-600"></div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
        >
          <Pencil className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {!isEditing ? (
        // View Mode
        <div className="relative px-4 pb-8">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80'}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-20 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
            
            <div className="mt-2 flex items-center justify-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{profile.location || 'Location not set'}</span>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">{profile.bio || 'No bio yet'}</p>
            </div>

            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Interests</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-rose-600 text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
              >
                <Heart className="w-4 h-4 mr-2" />
                Find Matches
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="p-4 mt-16">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            updateProfile();
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
              <input
                type="text"
                value={profile.interests.join(', ')}
                onChange={(e) => setProfile({ ...profile, interests: e.target.value.split(',').map(i => i.trim()) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}