import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  image_url: string;
  interests: string[];
}

interface HomeProps {
  session: Session;
}

export default function Home({ session }: HomeProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      
      // Get current user's matches to exclude
      const { data: matches } = await supabase
        .from('matches')
        .select('matched_user_id')
        .eq('user_id', session.user.id);

      const matchedIds = matches?.map(m => m.matched_user_id) || [];
      
      // Handle empty matches case
      const excludeIds = [session.user.id, ...matchedIds].filter(Boolean);
      
      // Get profiles excluding matched users and current user
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', excludeIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleMatch = async (profileId: string, status: 'liked' | 'disliked') => {
    try {
      const { error } = await supabase
        .from('matches')
        .insert([
          {
            user_id: session.user.id,
            matched_user_id: profileId,
            status,
          },
        ]);

      if (error) throw error;

      // Remove the profile from the list
      setProfiles(profiles.filter(p => p.id !== profileId));
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center text-rose-600">Heartbeat</h1>
      </header>

      <main className="p-4">
        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No more profiles to show right now.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((profile) => (
              <MatchCard
                key={profile.id}
                profile={profile}
                onLike={() => handleMatch(profile.id, 'liked')}
                onDislike={() => handleMatch(profile.id, 'disliked')}
              />
            ))}
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
}