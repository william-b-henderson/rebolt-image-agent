# AI Image Generation Agent

This project includes an advanced AI agent for SEO-optimized image generation and editing, leveraging OpenAI and Supabase for storage.

- **Location:** All core logic is in `lib/ai/` and `lib/supabase/`.
- **Agent:**
  - Defined in `lib/ai/agent.ts` as `createImageGenerationAgent()`.
  - Uses OpenAI's GPT-4o model and custom tools for image generation and editing.
  - Accepts prompts and context (business, site section, etc.) to generate or edit images.
  - Returns the generated image URL and a justification for SEO relevance.
- **Image Generation & Editing:**
  - `lib/ai/tools/generate-image.ts`: Generates images from prompts using OpenAI, then uploads them to Supabase Storage.
  - `lib/ai/tools/edit-image.ts`: Edits existing images based on prompts, also saving results to Supabase.
  - Both tools use schemas in `lib/ai/schemas.ts` for input/output validation.
- **Supabase Integration:**
  - `lib/supabase/queries.ts`: Handles uploading images (as base64) to Supabase Storage and retrieving public URLs.
  - `lib/supabase/server.ts`: Manages Supabase client creation for secure storage access.
- **API Endpoint:**
  - `app/(chat)/api/chat/route.ts`: Exposes a POST endpoint for image generation, calling the agent and returning the result.
 
## Demo 



https://github.com/user-attachments/assets/f2eb809e-22a8-4bf7-9739-352e9930fee2



## File Structure

```shell
rebolt-image-agent/
├── app/
│   ├── (chat)/
│   │   ├── actions.ts
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── chat-input.tsx
│   ├── chat.tsx
│   ├── image-upload-preview.tsx
│   ├── loading-image-message.tsx
│   ├── messages.tsx
│   ├── upload-image-button.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── scroll-area.tsx
│       ├── textarea.tsx
│       └── tooltip.tsx
├── lib/
│   ├── ai/
│   │   ├── agent.ts
│   │   ├── schemas.ts
│   │   └── tools/
│   │       ├── edit-image.ts
│   │       └── generate-image.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── server.ts
│   └── utils.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── ...
```

## How It Works

- User sends a prompt (and optionally an image) to the `/api/chat` endpoint.
- The AI agent generates or edits an image using OpenAI, based on the prompt and context.
- The resulting image is uploaded to Supabase Storage.
- The API returns the public URL of the image and a justification for its SEO relevance.
