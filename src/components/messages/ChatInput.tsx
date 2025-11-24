import React, { useState, useRef } from 'react';
import { RiSendPlaneFill, RiEmojiStickerLine, RiAttachmentLine, RiCloseLine, RiFileTextLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage?: (message: string, file?: File | null) => void;
  placeholder?: string;
  disabled?: boolean;
  isUploading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Type your message...',
  disabled = false,
  isUploading = false,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && onSendMessage && !disabled && !isUploading) {
      onSendMessage(message.trim(), selectedFile);
      setMessage('');
      setSelectedFile(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 w-full relative">
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-20 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800">
          <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
        </div>
      )}

      {selectedFile && (
        <div className="absolute bottom-full left-0 w-full p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <div className="relative group">
            {selectedFile.type.startsWith("image/") ? (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="preview" 
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" 
              />
            ) : (
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400">
                <RiFileTextLine size={24} />
              </div>
            )}
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600 transition-colors"
            >
              <RiCloseLine size={14} />
            </button>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Ready to send</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50 dark:focus-within:ring-purple-900/20 transition-all">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors ${showEmojiPicker ? 'bg-gray-200 dark:bg-gray-700 text-purple-500' : ''}`}
        >
          <RiEmojiStickerLine size={20} />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <RiAttachmentLine size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none text-sm px-3 py-2"
          type="text"
          placeholder={placeholder}
          disabled={disabled || isUploading}
        />
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || disabled || isUploading}
          className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center min-w-[40px]"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <RiSendPlaneFill size={16} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;

