import { uploadImage } from "@/lib/supabase/queries";
import { tool } from "@openai/agents";
import { z } from "zod";
import { ImageOutputSchema } from "../schemas";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const parametersSchema = z.object({
  prompt: z.string().describe("The prompt to generate an image from"),
  businessIndustry: z.string().describe("The business industry to generate an image for, inferred from the prompt"),
  siteSection: z.string().describe("The site section to generate an image for, inferred from the prompt"),
  randomContext: z.string().describe("A random context to generate an image for, inferred from the prompt").nullable().optional(),
});

export const generateImageTool = tool({
  name: "generate_image",
  description: "Generate an image from a text prompt",
  parameters: parametersSchema,
  /**
   * Executes the image generation tool using OpenAI's API.
   * @param input - The input object containing the prompt string.
   * @returns An object with the prompt, the generated image as base64, and the image URL if available.
   */
  execute: async (input: z.infer<typeof parametersSchema>): Promise<z.infer<typeof ImageOutputSchema>> => {
    // Zod validation ensures input shape
    const prompt = imageGenerationPrompt(input);
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
    });
    console.log('response', response);
    const imageData = response.data?.[0] || {};
    const b64_json = imageData.b64_json || null;
    if (!b64_json) {
      throw new Error('Image generation failed.');
    }
    let imageUrl: string | null = null;
    try {
      const filename = `${Date.now()}-${input.businessIndustry.replace(/\s+/g, '-')}-${input.siteSection.replace(/\s+/g, '-')}.png`;
      const { imageUrl: supabaseImageUrl } = await uploadImage(b64_json, filename);
      imageUrl = supabaseImageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed.');
    }
    return { prompt: input.prompt, imageUrl };
  },
});

const imageGenerationPrompt = (input: z.infer<typeof parametersSchema>) => {
  return `
  You are an expert SEO image generator that generates images based on a prompt.
  You are given a prompt and some context about the business and the site section.
  You need to generate an image that is relevant to the prompt and the context.
  The image should be a high-quality image that is relevant to the prompt and the context.
  The image should always be hyper realistic. Do not include any logos or text in the image unless it is explicitly requested.
  Do not include people in the image unless it is explicitly requested. The image should give an impression of the finished work of the business.
  The prompt is: ${input.prompt}
  The business industry is: ${input.businessIndustry}
  The site section is: ${input.siteSection}
  Some extra context is: ${input.randomContext || "None"}
  `;
}