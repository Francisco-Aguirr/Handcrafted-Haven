import { getArtisans } from "../actions/artisans";
import ArtisanCard from "@/components/ArtisanCard";

export default async function ArtisansPage() {

  const artisans = await getArtisans();
  
  return artisans.length === 0 ? (
    <p>No artisans available.</p>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Artisans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artisans.map((ar) => (
          <ArtisanCard key={ar.id} artisan={ar} />
        ))}
      </div>
    </div>
  );
}
