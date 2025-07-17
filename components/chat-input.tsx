import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SendIcon } from 'lucide-react';
import { useState } from 'react';
import { ImageUploadPreview } from './image-upload-preview';
import { AgentOutputSchema } from '@/lib/ai/schemas';
import { z } from 'zod';

export function ChatInput({
  id,
  onSendMessage,
  removeMessage,
}: {
  id: string;
  onSendMessage: (msg: any) => void;
  removeMessage: (id: string) => void;
}) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitForm(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    onSendMessage({ id: Date.now().toString(), text: input, sender: 'user' });

    // Add loading message
    const loadingId = Date.now().toString() + '-loading';
    onSendMessage({
      id: loadingId,
      sender: 'bot',
      loading: true,
      createdAt: Date.now(),
    });

    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, imageUrl }),
      });
      const data = (await res.json()) as z.infer<typeof AgentOutputSchema>;
      // Remove loading message
      removeMessage(loadingId);
      if (data.prompt) {
        onSendMessage({
          id: Date.now().toString() + '-prompt',
          text: data.prompt,
          sender: 'bot',
        });
      }
      if (data.imageUrl) {
        onSendMessage({
          id: Date.now().toString() + '-img',
          imageUrl: data.imageUrl,
          sender: 'bot',
        });
        setImageUrl(data.imageUrl);
      }
      if (data.imageJustification) {
        onSendMessage({
          id: Date.now().toString() + '-justification',
          text: data.imageJustification,
          sender: 'bot',
        });
      }
    } catch (err) {
      // Remove loading message
      removeMessage(loadingId);
      onSendMessage({
        id: Date.now().toString() + '-err',
        text: 'Error generating image.',
        sender: 'bot',
      });
    }
    setInput('');
    setImage(null);
    setLoading(false);
  }

  return (
    <form
      className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      onSubmit={submitForm}
    >
      <div className="relative w-full flex flex-col gap-4">
        <ImageUploadPreview onImageChange={setImage} />
        <Textarea
          data-testid="multimodal-input"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700"
          rows={2}
          autoFocus
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              submitForm();
            }
          }}
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          className="size-8 absolute right-2 bottom-2"
          disabled={loading || !input.trim()}
          variant="outline"
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
    </form>
  );
}
