import React, { useState } from 'react';
import { HiMagnifyingGlass, HiPencilSquare, HiEllipsisVertical } from 'react-icons/hi2';
import ChatListItem from '../../components/messages/ChatListItem';
import ChatHeader from '../../components/messages/ChatHeader';
import MessageBubble from '../../components/messages/MessageBubble';
import ChatInput from '../../components/messages/ChatInput';
import Breadcrumb from '../../components/Breadcrumb';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  message: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
}

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string>('roberto');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatList, setShowChatList] = useState(true);

  // Sample chat data
  const chats: Chat[] = [
    {
      id: 'emily',
      name: 'Emily James',
      lastMessage: "Be careful, it's raining outside! :)",
      timestamp: '08:45 PM',
      isOnline: true,
    },
    {
      id: 'alexander',
      name: 'Alexander Parker',
      lastMessage: 'It contains a lot of good lessons about effective...',
      timestamp: '08:42 PM',
      isOnline: false,
    },
    {
      id: 'esthera',
      name: 'Esthera William',
      lastMessage: 'Wow! This picture is amazing! Send me more!',
      timestamp: '06:32 PM',
      isOnline: false,
    },
    {
      id: 'lawrence',
      name: 'Lawrence Peter',
      lastMessage: 'You look so amazing today!',
      timestamp: '06:30 PM',
      isOnline: true,
    },
    {
      id: 'iaon',
      name: 'Iaon Dint',
      lastMessage: "I'm back from Belgium, do you want to meet?",
      timestamp: '05:57 PM',
      isOnline: true,
    },
    {
      id: 'william',
      name: 'William Jackson',
      lastMessage: "That's awesome!!! What technology do you used...",
      timestamp: '04:32 PM',
      isOnline: false,
    },
    {
      id: 'markus',
      name: 'Markus Aurelius',
      lastMessage: "Hello! How you doin'? I'm going to Italy this week...",
      timestamp: '01:08 PM',
      isOnline: true,
    },
    {
      id: 'roberto',
      name: 'Roberto Michael',
      lastMessage: 'Go and check it out! Here is the link: horizon-ui.com/chakra-pro/',
      timestamp: '09:02 PM',
      isOnline: false,
    },
  ];

  // Sample messages for Roberto Michael
  const robertoMessages: Message[] = [
    {
      id: '1',
      message: 'Hi there, How are you? All good?',
      timestamp: '09:00 PM',
      isSent: false,
    },
    {
      id: '2',
      message: 'I saw an amazing dashboard called Horizon UI Dashboard, is made by Simmmple, I want to know what you think about it, because I like it so much! 😊',
      timestamp: '09:00 PM',
      isSent: false,
    },
    {
      id: '3',
      message: 'Go and check it out! Here is the link: horizon-ui.com/chakra-pro/',
      timestamp: '09:02 PM',
      isSent: false,
    },
    {
      id: '4',
      message: 'Hello, Roberto! Hope you are fine! Let me take a look! Sounds interesting!',
      timestamp: '09:23 PM',
      isSent: true,
      isRead: true,
    },
    {
      id: '5',
      message: "OMG!! It's so innovative and awesome! I think I am going to buy it for my projects! It's a game changer!! 🔥",
      timestamp: '09:25 PM',
      isSent: true,
      isRead: true,
    },
  ];

  const [messages, setMessages] = useState<Message[]>(robertoMessages);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      isSent: true,
      isRead: false,
    };
    setMessages([...messages, newMessage]);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // On mobile, hide chat list when selecting a chat
    if (window.innerWidth < 768) {
      setShowChatList(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Messages' }]} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 relative overflow-hidden">
        {/* Chat List Section */}
        <div
          className={`${
            showChatList ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden`}
        >
          {/* Chat List Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Your chats
              </h2>
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                aria-label="More options"
              >
                <HiEllipsisVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* New Chat Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-2.5 rounded-lg hover:bg-purple-600 transition-colors font-medium">
              <HiPencilSquare className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                name={chat.name}
                lastMessage={chat.lastMessage}
                timestamp={chat.timestamp}
                avatar={chat.avatar}
                isOnline={chat.isOnline}
                isActive={selectedChat === chat.id}
                onClick={() => handleChatSelect(chat.id)}
              />
            ))}
          </div>
        </div>

        {/* Conversation Section */}
        <div
          className={`${
            !showChatList ? 'flex' : 'hidden'
          } lg:flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative`}
        >
          {/* Back Button for Mobile */}
          {!showChatList && (
            <button
              onClick={() => setShowChatList(true)}
              className="lg:hidden absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                name={selectedChatData.name}
                avatar={selectedChatData.avatar}
                isActive={selectedChatData.isOnline}
                onSearch={() => {}}
                onMoreOptions={() => {}}
              />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-800/50">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.message}
                    timestamp={msg.timestamp}
                    isSent={msg.isSent}
                    isRead={msg.isRead}
                  />
                ))}
              </div>

              {/* Message Input */}
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
