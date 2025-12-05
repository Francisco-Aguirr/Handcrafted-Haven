import { put } from '@vercel/blob';
import { uploadToCloudinary } from './cloudinary';

export async function uploadImageToBlob(file: File, folder: string = 'products') {
  try {
    console.log('Uploading image...');
    
    // Opción 1: Si tenemos Cloudinary configurado, usarlo
    if (process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET) {
      console.log('Using Cloudinary for upload');
      return await uploadToCloudinary(file, folder);
    }
    
    // Opción 2: Si tenemos Vercel Blob configurado
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('Using Vercel Blob for upload');
      const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const blob = await put(fileName, file, {
        access: 'public',
      });
      return blob.url;
    }
    
    // Opción 3: Fallback a base64 para desarrollo
    console.log('No storage configured, using base64 fallback');
    return await convertToBase64(file);
    
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Último recurso: base64
    console.log('Falling back to base64');
    return await convertToBase64(file);
  }
}

async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}