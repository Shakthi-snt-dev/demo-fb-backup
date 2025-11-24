import React from 'react';
import { twMerge } from 'tailwind-merge';
import { RiCheckLine, RiCheckDoubleLine, RiFileTextLine, RiDownloadLine } from 'react-icons/ri';

interface MessageBubbleProps {
  message?: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  avatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isSent = false,
  isRead = false,
  fileUrl,
  fileType,
  fileName,
  avatar,
}) => {
  return (
    <div
      className={twMerge(
        'flex w-full mb-2',
        isSent ? 'justify-end' : 'justify-start'
      )}>
      <div className={twMerge(
        'flex max-w-[75%] md:max-w-[65%] gap-2',
        isSent ? 'flex-row-reverse' : 'flex-row'
      )}>
        {!isSent && (
          <img 
            src={avatar || 'https://i.pravatar.cc/150?img=1'} 
            className="h-6 w-6 object-cover rounded-full self-end mb-1 shadow-sm flex-shrink-0" 
            alt="" 
          />
        )}
        <div className={twMerge(
          'flex flex-col',
          isSent ? 'items-end' : 'items-start'
        )}>
          <div
            className={twMerge(
              'px-3 py-2 rounded-2xl shadow-sm',
              isSent
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-100 rounded-bl-none'
            )}>
            {fileUrl && (
              <div className="mb-2">
                {fileType?.startsWith("image/") ? (
                  <img src={fileUrl} alt="attachment" className="max-w-full rounded-lg max-h-60 object-cover" />
                ) : (
                  <a 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={twMerge(
                      'flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity',
                      isSent ? 'bg-blue-500/20' : 'bg-white dark:bg-gray-700'
                    )}>
                    <RiFileTextLine size={24} />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium truncate max-w-[150px]">{fileName}</span>
                      <span className="text-[10px] opacity-70">Click to download</span>
                    </div>
                    <RiDownloadLine size={16} />
                  </a>
                )}
              </div>
            )}
            {message && (
              <p className="text-sm leading-snug break-words whitespace-pre-wrap">
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
                            ? 'text-blue-100 hover:text-white'
                            : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                        )}>
                        {part}
                      </a>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>
            )}
          </div>
          <p className={twMerge(
            'text-[10px] mt-0.5 px-1 font-medium flex items-center gap-1',
            isSent ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400 dark:text-gray-500'
          )}>
            {timestamp}
            {isSent && (
              isRead ? (
                <RiCheckDoubleLine className="text-blue-500" size={14} />
              ) : (
                <RiCheckLine className="text-gray-400" size={14} />
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;