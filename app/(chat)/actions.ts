'use server';

import { createImageGenerationAgent } from "@/lib/ai/agent";
import { AgentOutputSchema } from "@/lib/ai/schemas";
import { run } from "@openai/agents";
import { z } from "zod";

/**
 * Generates an image from a text prompt using the Rebolt Image Generation Agent.
 * @param prompt - The prompt describing the image to generate.
 * @returns The URL of the generated image, or null if generation failed.
 */
export async function generateImage(prompt: string, imageUrl?: string): Promise<z.infer<typeof AgentOutputSchema>> {
  const agent = createImageGenerationAgent()

  // Use the run function from @openai/agents to run the agent
  try {
    const result = await run(agent, `Generate an image of: ${prompt} ${imageUrl ? `and edit the following image to be relevant to the prompt: ${imageUrl}` : ''}`);
    console.log(result);
    return result.finalOutput as z.infer<typeof AgentOutputSchema>;
  } catch (error) {
    console.error(error);
    return {
      prompt: `Error generating image: ${error}`,
      imageUrl: null,
      imageJustification: null,
    };
  }
}
