import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
  isOnline?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  lastMessage,
  timestamp,
  avatar,
  isOnline = false,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors',
        isActive
          ? 'bg-purple-50 dark:bg-purple-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      )}
    >
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {timestamp}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;

