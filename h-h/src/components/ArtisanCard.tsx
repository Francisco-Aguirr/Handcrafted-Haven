"use client";

import Image from "next/image";
import { artisan } from "@/types/Artesian";

export default function ArtisanCard({ artisan }: { artisan: artisan }) {
    
    const goToPageartisan = (id: string) => {
        window.location.href = `/artisans/details/${id}`;
    }

    return (
        <div key={artisan.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-white  cursor-pointer"
            onClick={() => goToPageartisan(artisan.id)}>
            <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2 cursor-pointer">{artisan.name}</h2>
            <p className="text-gray-600">{artisan.bio}</p>
        </div>
    )

}

