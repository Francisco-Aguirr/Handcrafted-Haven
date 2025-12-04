'use server';

import { getArtisanById, listArtisans } from '@/lib/db/artisans';

export async function getArtisans() {
  try {
    const artisans = await listArtisans();
    return artisans;
  } catch (error) {
    console.error('Error fetching artisans:', error);
    return [];
  }
}

export async  function getArtisan(id: string) {

  try{

    const artisan = await getArtisanById(id);
    return artisan;

  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}