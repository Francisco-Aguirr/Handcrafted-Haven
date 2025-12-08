// src/app/artisans/page.tsx (versión simple)
import { getArtisans } from '@/app/actions/artisans';
import ArtisanCard from '@/components/ArtisanCard';

export default async function ArtisansPage() {
  const artisans = await getArtisans();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Artisans</h1>
      
      {artisans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No artisans found.</p>
          <p className="text-gray-500">Check back later for talented artisans.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-8">
            Discover {artisans.length} talented artisans creating unique handcrafted products.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}