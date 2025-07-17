import React from 'react';
import { LoadingImageSquare } from './loading-image-message';

export function Messages({ id, messages }: { id: string; messages: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2 p-2 px-4">
      {messages.map((msg, i) => (
        <div
          key={msg.id || i}
          className={`flex ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div className="max-w-lg rounded-lg p-2 bg-muted">
            {msg.loading ? (
              <LoadingImageSquare createdAt={msg.createdAt} />
            ) : (
              <>
                {msg.text && <span>{msg.text}</span>}
                {msg.imageUrl ? (
                  <img
                    src={msg.imageUrl}
                    alt="Generated"
                    className="mt-2 rounded-lg max-w-full h-auto"
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
