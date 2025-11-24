import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HiPencilSquare, HiEllipsisVertical } from 'react-icons/hi2';
import { RiCloseLine, RiSearchLine } from 'react-icons/ri';
import { FaSignInAlt, FaUserPlus, FaUserShield, FaLock } from 'react-icons/fa';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, onSnapshot, collection, getDocs, DocumentSnapshot } from 'firebase/firestore';
import MessageBubble from '../../../components/messages/MessageBubble';
import ChatInput from '../../../components/messages/ChatInput';
import Breadcrumb from '../../../components/Breadcrumb';
import { 
  type User,
  type Chat,
  type Message as FirebaseMessage,
  type FileData,
  auth,
  db,
  listenForChats,
  listenForMessages,
  sendMessage,
  uploadFile,
  markMessagesAsRead,
  getAdminUser,
  createChat,
  initializeUserChatWithAdmin,
  initializeAdminChats,
} from '../../../firebase/firebase';
import { formatMessageTime } from '../../../utils/formatTimestamp';
import defaultAvatar from '../../../assets/logo.png';
import logo from '../../../assets/logo.png';

const Messages: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<FirebaseMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'adminLogin' | 'adminRegister'>('login');
  const [authFormData, setAuthFormData] = useState({ fullName: '', email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const adminChatCreatedRef = useRef(false);

  // Check Firebase authentication
  useEffect(() => {
    setIsCheckingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Get current user from Firestore
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser?.uid) return;
    
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot: DocumentSnapshot) => {
      if (docSnapshot.exists()) {
        setCurrentUser(docSnapshot.data() as User);
      }
    });
    return unsubscribe;
  }, [isAuthenticated]);

  // Get admin user
  useEffect(() => {
    const fetchAdmin = async () => {
      const admin = await getAdminUser();
      setAdminUser(admin);
    };
    fetchAdmin();
  }, []);

  // Listen for chats
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubscribe = listenForChats(setChats);
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  // Ensure admin chat exists for current user (only once)
  useEffect(() => {
    const ensureAdminChat = async () => {
      if (adminUser && currentUser && !currentUser.isAdmin && auth?.currentUser && !adminChatCreatedRef.current) {
        const hasAdminChat = chats.some((chat) =>
          chat?.users?.some((u) => u.uid === adminUser.uid)
        );

        if (!hasAdminChat) {
          adminChatCreatedRef.current = true;
          await createChat(currentUser, adminUser);
        } else {
          adminChatCreatedRef.current = true;
        }
      }
    };
    ensureAdminChat();
  }, [adminUser, currentUser, chats]);

  // Listen for messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !auth.currentUser?.uid) {
      setMessages([]);
      return;
    }

    const chatId = auth.currentUser.uid < selectedUser.uid 
      ? `${auth.currentUser.uid}-${selectedUser.uid}` 
      : `${selectedUser.uid}-${auth.currentUser.uid}`;

    const unsubscribe = listenForMessages(chatId, setMessages);
    return () => {
      unsubscribe();
    };
  }, [selectedUser]);

  // Mark messages as read
  useEffect(() => {
    if (!selectedUser || !auth.currentUser?.uid || messages.length === 0) return;

    const chatId = auth.currentUser.uid < selectedUser.uid 
      ? `${auth.currentUser.uid}-${selectedUser.uid}` 
      : `${selectedUser.uid}-${auth.currentUser.uid}`;

    markMessagesAsRead(chatId);
  }, [messages, selectedUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Search users
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          const normalizedSearchTerm = searchQuery.toLowerCase();
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(usersRef);

          const foundUsers: User[] = [];
          querySnapshot.forEach((docSnapshot: DocumentSnapshot) => {
            const userData = docSnapshot.data() as User;
            if (
              (userData.username?.toLowerCase().includes(normalizedSearchTerm) ||
              userData.fullName?.toLowerCase().includes(normalizedSearchTerm)) &&
              userData.uid !== auth.currentUser?.uid
            ) {
              foundUsers.push(userData);
            }
          });
          setSearchResults(foundUsers);
        } catch (error) {
          console.error("Error searching users:", error);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Sort messages by timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTimestamp = a?.timestamp?.seconds + (a?.timestamp?.nanoseconds || 0) / 1e9;
      const bTimestamp = b?.timestamp?.seconds + (b?.timestamp?.nanoseconds || 0) / 1e9;
      return aTimestamp - bTimestamp;
    });
  }, [messages]);

  // Sort chats by last message timestamp - Filter based on user type
  const sortedChats = useMemo(() => {
    let chatsToShow = [...chats];

    // Filter chats based on user role
    if (currentUser) {
      if (currentUser.isAdmin) {
        // Admin sees all chats with all users
        chatsToShow = chats.filter((chat) => 
          chat?.users?.some((u) => u.uid === currentUser.uid) &&
          chat?.users?.some((u) => u.uid !== currentUser.uid)
        );
      } else {
        // Regular users only see chats with admin
        chatsToShow = chats.filter((chat) => {
          const hasCurrentUser = chat?.users?.some((u) => u.uid === currentUser.uid);
          const hasAdmin = adminUser && chat?.users?.some((u) => u.uid === adminUser.uid);
          return hasCurrentUser && hasAdmin;
        });

        // If no admin chat exists, add placeholder
        if (adminUser) {
          const hasAdminChat = chatsToShow.some((chat) =>
            chat?.users?.some((u) => u.uid === adminUser.uid)
          );

          if (!hasAdminChat) {
            chatsToShow.push({
              id: `admin-${currentUser.uid}`,
              users: [adminUser, currentUser],
              lastMessage: "Start a conversation with admin",
              lastMessageTimestamp: { seconds: Date.now() / 1000, nanoseconds: 0 },
            });
          }
        }
      }
    }

    return chatsToShow.sort((a, b) => {
      const aTimestamp = a?.lastMessageTimestamp?.seconds + (a?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      const bTimestamp = b?.lastMessageTimestamp?.seconds + (b?.lastMessageTimestamp?.nanoseconds || 0) / 1e9;
      return bTimestamp - aTimestamp;
    });
  }, [chats, adminUser, currentUser]);

  const handleSendMessage = async (messageText: string, file: File | null = null) => {
    if (!selectedUser || !auth.currentUser?.uid) return;
    if (!messageText.trim() && !file) return;

    setIsUploading(true);
    try {
      let fileData: FileData | null = null;
      if (file) {
        const downloadURL = await uploadFile(file);
        fileData = {
          url: downloadURL,
          type: file.type,
          name: file.name
        };
      }

      const chatId = auth.currentUser.uid < selectedUser.uid 
        ? `${auth.currentUser.uid}-${selectedUser.uid}` 
        : `${selectedUser.uid}-${auth.currentUser.uid}`;

      await sendMessage(messageText, chatId, auth.currentUser.uid, selectedUser.uid, fileData);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Start chat with a user
  const startChat = (userToChat: User) => {
    if (!userToChat || !userToChat.uid) {
      return;
    }
    
    setSelectedUser(userToChat);
  };

  // Start new chat from search
  const startNewChat = (userToChat: User) => {
    startChat(userToChat);
  };

  // Handle Login
  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authFormData.email, authFormData.password);
      setAuthFormData({ fullName: '', email: '', password: '' });
    } catch (error: any) {
      setAuthError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authFormData.email, authFormData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocument: User = {
        uid: user.uid,
        email: user.email || '',
        username: user.email?.split("@")[0]?.toLowerCase() || "",
        fullName: authFormData.fullName,
        image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        isAdmin: false,
        status: "online",
      };

      await setDoc(userDocRef, userDocument);
      await initializeUserChatWithAdmin(userDocument);
      setAuthFormData({ fullName: '', email: '', password: '' });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please login instead.');
        setAuthMode('login');
      } else {
        setAuthError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, authFormData.email, authFormData.password);
      setAuthFormData({ fullName: '', email: '', password: '' });
    } catch (error: any) {
      setAuthError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Register
  const handleAdminRegister = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authFormData.email, authFormData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocument: User = {
        uid: user.uid,
        email: user.email || '',
        username: user.email?.split("@")[0]?.toLowerCase() || "",
        fullName: authFormData.fullName,
        image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        isAdmin: true,
        status: "online",
      };

      await setDoc(userDocRef, userDocument);
      await initializeAdminChats(userDocument);
      setAuthFormData({ fullName: '', email: '', password: '' });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please login instead.');
        setAuthMode('adminLogin');
      } else {
        setAuthError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      handleLogin();
    } else if (authMode === 'register') {
      handleRegister();
    } else if (authMode === 'adminLogin') {
      handleAdminLogin();
    } else if (authMode === 'adminRegister') {
      handleAdminRegister();
    }
  };

  const senderEmail = auth.currentUser?.email || '';

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden -m-4 lg:-m-6" style={{ width: 'calc(100% + 2rem)', maxWidth: 'calc(100% + 2rem)' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login/register form if not authenticated
  if (!isAuthenticated) {
    const isAdminMode = authMode === 'adminLogin' || authMode === 'adminRegister';
    
    return (
      <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900">
        <div className="mb-4 px-4 pt-4 flex-shrink-0">
          <Breadcrumb items={[{ label: 'Messages' }]} />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className={`w-full max-w-md ${isAdminMode ? 'bg-slate-800/50 backdrop-blur-xl border border-slate-700' : 'bg-white/80 backdrop-blur-sm border border-slate-100'} shadow-2xl p-8 rounded-2xl`}>
            <div className="mb-8 text-center">
              <img src={logo} alt="FlowTap" className="h-10 mx-auto mb-4" />
              {isAdminMode ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <FaUserShield className="text-white text-2xl" />
                  </div>
                  <h1 className={`text-3xl font-bold mb-2 ${isAdminMode ? 'text-white' : 'text-slate-900'}`}>
                    {authMode === 'adminLogin' ? 'Admin Portal' : 'Create Admin Account'}
                  </h1>
                  <p className={isAdminMode ? 'text-slate-400' : 'text-slate-500'}>
                    {authMode === 'adminLogin' ? 'Secure access for administrators' : 'Set up your administrative access'}
                  </p>
                </>
              ) : (
                <>
                  <h1 className={`text-3xl font-bold mb-2 ${isAdminMode ? 'text-white' : 'text-slate-900'}`}>
                    {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className={isAdminMode ? 'text-slate-400' : 'text-slate-500'}>
                    {authMode === 'login' ? 'Sign in to continue to your chat' : 'Join our community today'}
                  </p>
                </>
              )}
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {(authMode === 'register' || authMode === 'adminRegister') && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isAdminMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={authFormData.fullName}
                    onChange={(e) => setAuthFormData({ ...authFormData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border transition-all ${
                      isAdminMode
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'
                    } focus:outline-none focus:border-transparent`}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isAdminMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isAdminMode ? 'Admin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    className={`w-full ${isAdminMode ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-lg border transition-all ${
                      isAdminMode
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'
                    } focus:outline-none focus:border-transparent`}
                    placeholder={isAdminMode ? "admin@company.com" : "name@example.com"}
                    required
                  />
                  {isAdminMode && (
                    <FaUserShield className="absolute left-3 top-3.5 text-slate-500" />
                  )}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isAdminMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    className={`w-full ${isAdminMode ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-lg border transition-all ${
                      isAdminMode
                        ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500'
                    } focus:outline-none focus:border-transparent`}
                    placeholder="••••••••"
                    required
                  />
                  {isAdminMode && (
                    <FaLock className="absolute left-3 top-3.5 text-slate-500" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${
                  isAdminMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                }`}
              >
                {authLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && 'Sign In'}
                      {authMode === 'register' && 'Sign Up'}
                      {authMode === 'adminLogin' && 'Access Dashboard'}
                      {authMode === 'adminRegister' && 'Register Admin'}
                    </span>
                    {authMode === 'login' || authMode === 'adminLogin' ? (
                      <FaSignInAlt />
                    ) : authMode === 'register' ? (
                      <FaUserPlus />
                    ) : (
                      <FaUserShield />
                    )}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {isAdminMode ? (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                      setAuthFormData({ fullName: '', email: '', password: '' });
                    }}
                    className={`text-sm transition-colors block w-full ${isAdminMode ? 'text-slate-400 hover:text-white' : 'text-slate-500'}`}
                  >
                    Return to User Login
                  </button>
                  <p className={`text-xs mt-4 ${isAdminMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {authMode === 'adminLogin' ? (
                      <>
                        Need an admin account?{" "}
                        <button
                          onClick={() => {
                            setAuthMode('adminRegister');
                            setAuthError('');
                            setAuthFormData({ fullName: '', email: '', password: '' });
                          }}
                          className="text-blue-500 hover:text-blue-400 font-medium"
                        >
                          Create Admin Account
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an admin account?{" "}
                        <button
                          onClick={() => {
                            setAuthMode('adminLogin');
                            setAuthError('');
                            setAuthFormData({ fullName: '', email: '', password: '' });
                          }}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className={`text-sm ${isAdminMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {authMode === 'login' ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          onClick={() => {
                            setAuthMode('register');
                            setAuthError('');
                            setAuthFormData({ fullName: '', email: '', password: '' });
                          }}
                          className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setAuthError('');
                            setAuthFormData({ fullName: '', email: '', password: '' });
                          }}
                          className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                        >
                          Sign In
                        </button>
                      </>
                    )}
                  </p>
                  <p className={`text-xs ${isAdminMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <button
                      onClick={() => {
                        setAuthMode('adminLogin');
                        setAuthError('');
                        setAuthFormData({ fullName: '', email: '', password: '' });
                      }}
                      className="hover:underline transition-colors"
                    >
                      Admin Login
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden -m-4 lg:-m-6" style={{ width: 'calc(100% + 2rem)', maxWidth: 'calc(100% + 2rem)' }}>
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Chat List */}
        <section 
          className={`${
            showChatList ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-[320px] xl:w-[360px] bg-white dark:bg-gray-800 h-full overflow-hidden flex-shrink-0`}
        >
          {/* Chat List Header */}
          <header className="flex items-center justify-between w-full p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={currentUser?.image || defaultAvatar} 
                  className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-gray-600 shadow-sm" 
                  alt="" 
                />
                {currentUser?.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                  {currentUser?.fullName || "Flow Tap User"}
                </h3>
                <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                  @{currentUser?.username || "flowtap"}
                </p>
              </div>
            </div>
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              aria-label="More options"
            >
              <HiEllipsisVertical className="w-5 h-5" />
            </button>
          </header>

          {/* Search Bar */}
          <div className="w-full px-4 py-3 flex-shrink-0">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search Messenger"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm rounded-lg pl-10 pr-8 py-2 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearching(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <RiCloseLine size={16} />
                </button>
              )}
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pb-3 flex-shrink-0">
            <button 
              onClick={() => setIsSearching(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors font-medium shadow-sm"
            >
              <HiPencilSquare className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <main className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2 space-y-1 min-h-0">
            {isSearching ? (
              // Search Results
              searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <button
                    key={u.uid}
                    onClick={(e) => {
                      e.preventDefault();
                      startNewChat(u);
                    }}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={u?.image || defaultAvatar} 
                          className="h-10 w-10 rounded-full object-cover shadow-sm" 
                          alt="" 
                        />
                        {u?.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          {u?.fullName || "Flow Tap User"}
                        </h2>
                        <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                          @{u?.username || "flowtap"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                  No users found
                </div>
              )
            ) : (
              // Chat List
              <>
                <h3 className="px-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-1">
                  Messages ({sortedChats?.length || 0})
                </h3>
                {sortedChats?.length > 0 ? (
                  sortedChats.map((chat) => {
                    // Get the other user (not current user)
                    const otherUser = chat?.users?.find((u) => u?.email !== auth.currentUser?.email);
                    if (!otherUser) return null;

                    return (
                      <button
                        key={chat?.id}
                        onClick={(e) => {
                          e.preventDefault();
                          startChat(otherUser);
                        }}
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-all group border border-transparent ${
                          selectedUser?.uid === otherUser.uid
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img 
                              src={otherUser?.image || defaultAvatar} 
                              className="h-10 w-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
                              alt="" 
                            />
                            {otherUser?.status === 'online' && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                              {otherUser?.fullName || "Flow Tap User"}
                            </h2>
                            <p className="font-medium text-gray-500 dark:text-gray-400 text-xs truncate">
                              {chat?.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                          <p className="font-medium text-gray-400 dark:text-gray-500 text-[10px] whitespace-nowrap">
                            {formatMessageTime(chat?.lastMessageTimestamp)}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="w-full text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    No conversations yet. Start a new chat!
                  </div>
                )}
              </>
            )}
          </main>
        </section>

        {/* Middle Panel - Conversation */}
        <section
          className={`${
            !showChatList ? 'flex' : 'hidden'
          } lg:flex flex-col flex-1 min-w-0 h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden`}
        >
          {/* Back Button for Mobile */}
          {!showChatList && (
            <button
              onClick={() => setShowChatList(true)}
              className="lg:hidden absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
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
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <header className="w-full p-3 bg-white dark:bg-gray-800 flex-shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={selectedUser?.image || defaultAvatar} 
                      className="w-9 h-9 object-cover rounded-full border border-gray-200 dark:border-gray-600" 
                      alt="" 
                    />
                    {selectedUser?.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                      {selectedUser?.fullName || "Flow Tap User"}
                    </h3>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                      @{selectedUser?.username || "flowtap"}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  aria-label="More options"
                >
                  <HiEllipsisVertical className="w-5 h-5" />
                </button>
              </header>

              {/* Messages Area */}
              <main className="flex-1 flex flex-col overflow-hidden min-h-0">
                <section className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4" ref={scrollRef}>
                  <div className="flex flex-col gap-2 min-h-full justify-end">
                    {sortedMessages?.length > 0 ? (
                      sortedMessages.map((msg, index) => {
                        const isSent = msg?.sender === senderEmail;
                        return (
                          <MessageBubble
                            key={index}
                            message={msg.text}
                            timestamp={formatMessageTime(msg?.timestamp)}
                            isSent={isSent}
                            isRead={msg?.status === "read"}
                            fileUrl={msg?.fileUrl}
                            fileType={msg?.fileType}
                            fileName={msg?.fileName}
                            avatar={!isSent ? (selectedUser?.image || defaultAvatar) : undefined}
                          />
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Message Input */}
                <div className="p-3 bg-white dark:bg-gray-800 flex-shrink-0">
                  <ChatInput 
                    onSendMessage={handleSendMessage}
                    isUploading={isUploading}
                  />
                </div>
              </main>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="max-w-md w-full flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <img src={defaultAvatar} alt="" className="w-8 h-8 object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to Flow Tap</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  Select a conversation from the sidebar or start a new one to begin messaging.
                </p>
              </div>
            </div>
          )}
        </section>

        
      </div>
    </div>
  );
};

export default Messages;