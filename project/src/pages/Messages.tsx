import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Send } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Match {
  id: string;
  name: string;
  image_url: string;
  last_message?: string;
  last_message_time?: string;
}

interface MessagesProps {
  session: Session;
}

export default function Messages({ session }: MessagesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      setLoading(true);
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          matched_user_id,
          profiles:matched_user_id (
            name,
            image_url
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'matched');

      if (matchesError) throw matchesError;

      const formattedMatches = matchesData.map(match => ({
        id: match.id,
        name: match.profiles.name,
        image_url: match.profiles.image_url,
      }));

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedMatch) return;

    // Here you would implement the message sending logic
    // For now, we'll just clear the input
    setMessage('');
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
        <h1 className="text-2xl font-bold text-center text-rose-600">Messages</h1>
      </header>
      <main className="p-4">
        {/* Add your messages content here */}
        <p className="text-center text-gray-600">Coming soon...</p>
      </main>
      <Navbar />
    </div>
  );
}