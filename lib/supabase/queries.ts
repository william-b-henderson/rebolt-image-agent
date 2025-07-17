import { decode } from "base64-arraybuffer";
import { createAdminClient, createClient } from "./server";


export async function uploadImage(b64: string, filename: string) {
  const supabase = await createAdminClient();
  console.log('uploading image', filename);
  const { data, error } = await supabase.storage.from('images').upload(filename, decode(b64), {
    contentType: 'image/png',
  });
  if (error) {
    throw error;
  }
  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
  console.log('image uploaded', publicUrl);
  return { imageUrl: publicUrl };
}


export async function getImageUrl(filename: string): Promise<string> {
  const supabase = await createClient();
  const { data } =  supabase.storage.from('images').getPublicUrl(filename);
  return data.publicUrl;
}