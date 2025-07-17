import z from "zod";

export const ImageOutputSchema = z.object({
  prompt: z.string(),
  imageUrl: z.string().nullable(),
});

export const AgentOutputSchema = z.object({
  prompt: z.string().describe("The prompt that was used to generate the image"),
  imageUrl: z.string().nullable().describe("The URL of the image that was generated"),
  imageJustification: z.string().nullable().describe("The justification for the image that was generated"),
});