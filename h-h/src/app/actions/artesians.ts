'use server';

import { listArtesians } from '@/lib/db/artesians';

export async function getArtesians() {
  try {
    const artesians = await listArtesians();
    return artesians;
  } catch (error) {
    console.error('Error fetching artesians:', error);
    return [];
  }
}