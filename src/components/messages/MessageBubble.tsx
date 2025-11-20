import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isSent = false,
  isRead = false,
}) => {
  return (
    <div
      className={twMerge(
        'flex mb-4',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={twMerge(
          'max-w-[70%] sm:max-w-[60%] md:max-w-[50%] rounded-2xl px-4 py-2.5',
          isSent
            ? 'bg-purple-500 text-white rounded-br-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
        )}
      >
        <p className="text-sm sm:text-base leading-relaxed break-words">
          {message.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={twMerge(
                    'underline',
                    isSent
                      ? 'text-purple-100 hover:text-white'
                      : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'
                  )}
                >
                  {part}
                </a>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </p>
        <div
          className={twMerge(
            'flex items-center justify-end gap-1 mt-1',
            isSent ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          <span className="text-xs">{timestamp}</span>
          {isSent && (
            <span className="text-xs">
              {isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

