'use client';
import { generateUserID } from '@/lib/utils';
import * as React from 'react';
import { Messages } from './messages';
import { ChatInput } from './chat-input';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from './ui/button';

export interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: 'user' | 'bot';
}

export function Chat() {
  const [mounted, setMounted] = React.useState(false);
  const [userId, setUserId] = useLocalStorage<string | undefined>(
    'userId',
    undefined
  );
  // Use useLocalStorage for messages
  const [messages, setMessages] = useLocalStorage<Message[]>('messages', []);

  // Function to remove a message by ID
  const removeMessage = (id: string) => {
    setMessages((msgs) => msgs.filter((msg) => msg.id !== id));
  };

  React.useEffect(() => {
    setMounted(true);
    if (!userId) {
      const newId = generateUserID();
      setUserId(newId);
    }
  }, [userId, setUserId]);

  if (!mounted || !userId) return null; // or a loading spinner

  // Show 'New Chat' button if there are messages
  const showNewChat = messages && messages.length > 0;

  return (
    <div className="flex flex-col w-full h-full justify-end items-center md:max-w-3xl relative">
      {showNewChat && (
        <Button
          className="absolute top-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-md z-10"
          variant="outline"
          onClick={() => setMessages([])}
        >
          New Chat
        </Button>
      )}
      <Messages id={userId} messages={messages} />
      <ChatInput
        id={userId}
        onSendMessage={(msg) => setMessages((m) => [...m, msg])}
        removeMessage={removeMessage}
      />
    </div>
  );
}
