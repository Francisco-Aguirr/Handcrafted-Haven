import React from 'react';
import ArtisanDetails from '@/components/ArtisanDetails';
import { getArtisan } from '@/app/actions/artisans';

export default async function ArtisanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const artisan = await getArtisan(id);

  if (!artisan) {
    return <div>artisan not found</div>;
  }

  return (
      <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6" >   
        <ArtisanDetails {...artisan} />
      </div>
  );
}