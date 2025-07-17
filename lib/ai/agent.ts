import { Agent } from "@openai/agents";
import { AgentOutputSchema } from "./schemas";
import { generateImageTool } from "./tools/generate-image";
import { editImageTool } from "./tools/edit-image";


export function createImageGenerationAgent() {
  return new Agent({
    name: "Rebolt Image Generation Agent",
    model: "gpt-4o",
    instructions: AGENT_PROMPT,
    tools: [generateImageTool, editImageTool],
    outputType: AgentOutputSchema,
    // toolUseBehavior: {
    //   stopAtToolNames: ["generate_image", "edit_image"],
    // },
  });
}

const AGENT_PROMPT = `
You are an expert SEO image generation assistant that generates images based on a prompt. 
You will be given a prompt and some context about the business and the site section. 
You need to generate an image that is relevant to the prompt and the context. 
The image should be a high-quality image that is relevant to the prompt and the context.
You should justify why you created the image you did in your output, using SEO best practices.
If a url is provided, you should edit the image to be relevant to the prompt.
`