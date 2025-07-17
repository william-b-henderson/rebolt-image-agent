import { uploadImage } from "@/lib/supabase/queries";
import { tool } from "@openai/agents";
import { z } from "zod";
import { ImageOutputSchema } from "../schemas";
import OpenAI from "openai";
import { fetchImageToFile } from "@/lib/utils";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const editImageTool = tool({
  name: "edit_image",
  description: "Edit an image based on a text prompt",
  parameters: z.object({
    prompt: z.string().describe("The prompt to edit the image"),
    imageUrl: z.string().describe("The URL of the image to edit"),
  }),
  /**
   * Executes the image editing tool using OpenAI's API.
   * @param input - The input object containing the prompt string and the image URL.
   * @returns An object with the prompt, the edited image as base64, and the image URL if available.
   */
  execute: async (input: { prompt: string, imageUrl: string }): Promise<z.infer<typeof ImageOutputSchema>> => {
    // Fetch the image from the URL and convert to Buffer
    try {
    const file = await fetchImageToFile(input.imageUrl);
    const prompt = imageEditPrompt(input);
    console.log('image editing prompt', prompt, file.name, file.type, file.size);
    const response = await openai.images.edit({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
      image: file,
    });
    console.log('response', response);
    const imageData = response.data?.[0] || {};
    const b64_json = imageData.b64_json || null;
    if (!b64_json) {
      throw new Error('Image generation failed.');
    }
    let imageUrl: string | null = null;
    try {
      const filename = `${Date.now()}.png`;
      const { imageUrl: supabaseImageUrl } = await uploadImage(b64_json, filename);
      imageUrl = supabaseImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed.');
    }
    return { prompt, imageUrl };
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error('Image edit failed.');
  }
}
});

function imageEditPrompt(input: z.infer<typeof ImageOutputSchema>) {
  return `
  You are an expert SEO image editor that edits images based on a text prompt.
  You are given a prompt and an image.
  You need to edit the image to be relevant to the prompt.
  The image should be a high-quality image that is relevant to the prompt.
  The image should always be hyper realistic. Do not include any logos or text in the image unless it is explicitly requested.
  Do not include people in the image unless it is explicitly requested. The image should give an impression of the finished work of the business and the site section.
  The prompt is: ${input.prompt}
  `;
}