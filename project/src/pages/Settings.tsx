import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { LogOut, Bell, Shield, Moon, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface SettingsProps {
  session: Session;
}

export default function Settings({ session }: SettingsProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="pb-20">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center text-rose-600">Settings</h1>
      </header>
      <main className="p-4">
        <button
          onClick={handleSignOut}
          className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700"
        >
          Sign Out
        </button>
      </main>
      <Navbar />
    </div>
  );
}