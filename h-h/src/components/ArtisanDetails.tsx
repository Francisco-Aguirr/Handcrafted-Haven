"use client";

import Image from "next/image";
import { artisan } from "@/types/Artesian";

export default function ArtisanDetails(artisan: artisan) {
  
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg">
        <div className="relative aspect-square">
          <img 
          src={artisan.avatar} 
          alt={artisan.name} 
          className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{artisan.name}</h1>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
              <p className="text-gray-700">
                {artisan.bio}
              </p>
            </div>
        </div>
      </div>
  );
}