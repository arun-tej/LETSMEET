import React from 'react';
import { Heart, X } from 'lucide-react';

interface MatchCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    bio: string;
    image_url: string;
    interests: string[];
  };
  onLike: () => void;
  onDislike: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ profile, onLike, onDislike }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={profile.image_url} 
          alt={profile.name} 
          className="w-full h-96 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-2xl font-semibold text-white">{profile.name}, {profile.age}</h2>
          <p className="text-white/90">{profile.location}</p>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-3">{profile.bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>

        <div className="flex justify-around">
          <button 
            onClick={onDislike}
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
          <button 
            onClick={onLike}
            className="p-4 rounded-full bg-rose-100 hover:bg-rose-200 transition-colors"
          >
            <Heart size={24} className="text-rose-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;