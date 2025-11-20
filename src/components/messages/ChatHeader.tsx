import React from 'react';
import { HiMagnifyingGlass, HiEllipsisVertical } from 'react-icons/hi2';

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isActive?: boolean;
  onSearch?: () => void;
  onMoreOptions?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  isActive = false,
  onSearch,
  onMoreOptions,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {name}
          </h2>
          {isActive && (
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Active
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
          aria-label="Search"
        >
          <HiMagnifyingGlass className="w-5 h-5" />
        </button>
        <button
          onClick={onMoreOptions}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
          aria-label="More options"
        >
          <HiEllipsisVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

