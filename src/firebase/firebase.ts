import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    getFirestore, 
    query, 
    serverTimestamp, 
    setDoc, 
    where,
    onSnapshot,
    addDoc,
    updateDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCQfJ36E5Awz7_de3X_n6Av5iEl3QLx0CE",
    authDomain: "flowtap.firebaseapp.com",
    projectId: "flowtap",
    storageBucket: "flowtap.firebasestorage.app",
    messagingSenderId: "1016841487974",
    appId: "1:1016841487974:web:381ef9c801a05b7b8fcfa7",
    measurementId: "G-8FBDEDRVW7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export interface User {
    uid: string;
    email: string;
    fullName?: string;
    username?: string;
    image?: string;
    isAdmin?: boolean;
    status?: string;
    lastSeen?: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface Chat {
    id: string;
    users: User[];
    lastMessage: string;
    lastMessageTimestamp: {
        seconds: number;
        nanoseconds: number;
    };
}

export interface Message {
    text?: string;
    sender: string;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    status?: "sent" | "read";
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
}

export interface FileData {
    url: string;
    type: string;
    name: string;
}

// Listen for chats in real-time
export const listenForChats = (setChats: (chats: Chat[]) => void) => {
    const chatsRef = collection(db, "chats");
    const unsubscribe = onSnapshot(chatsRef, 
        (snapshot) => {
            const chatList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Chat[];

            const filteredChats = chatList.filter((chat) => 
                chat?.users?.some((user) => user.email === auth.currentUser?.email)
            );

            setChats(filteredChats);
        },
        (error) => {
            console.error("Error listening to chats:", error);
        }
    );

    return unsubscribe;
};

// Upload file to Firebase Storage
export const uploadFile = async (file: File): Promise<string> => {
    try {
        const storageRef = ref(storage, `chat_files/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// Send a message
export const sendMessage = async (
    messageText: string, 
    chatId: string, 
    user1: string, 
    user2: string, 
    file: FileData | null = null
): Promise<void> => {
    const chatRef = doc(db, "chats", chatId);

    const user1Doc = await getDoc(doc(db, "users", user1));
    const user2Doc = await getDoc(doc(db, "users", user2));

    const user1Data = user1Doc.data() as User;
    const user2Data = user2Doc.data() as User;

    const chatDoc = await getDoc(chatRef);
    
    let lastMessageContent = messageText;
    if (file) {
        lastMessageContent = file.type.startsWith("image/") ? "📷 Image" : "📎 File";
        if (messageText) lastMessageContent += `: ${messageText}`;
    }

    if (!chatDoc.exists()) {
        await setDoc(chatRef, {
            users: [user1Data, user2Data],
            lastMessage: lastMessageContent,
            lastMessageTimestamp: serverTimestamp(),
        });
    } else {
        await updateDoc(chatRef, {
            lastMessage: lastMessageContent,
            lastMessageTimestamp: serverTimestamp(),
        });
    }

    const messageRef = collection(db, "chats", chatId, "messages");

    const messageData: any = {
        text: messageText,
        sender: auth.currentUser?.email || "",
        timestamp: serverTimestamp(),
        status: "sent",
    };

    if (file) {
        messageData.fileUrl = file.url;
        messageData.fileType = file.type;
        messageData.fileName = file.name;
    }

    await addDoc(messageRef, messageData);
};

// Mark messages as read
export const markMessagesAsRead = async (chatId: string): Promise<void> => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, where("status", "==", "sent"));

    const querySnapshot = await getDocs(q);

    const updatePromises: Promise<void>[] = [];
    querySnapshot.forEach((docSnapshot) => {
        const messageData = docSnapshot.data();
        // Only mark messages as read if the sender is NOT the current user
        if (messageData.sender !== auth.currentUser?.email) {
            const messageDocRef = doc(db, "chats", chatId, "messages", docSnapshot.id);
            updatePromises.push(updateDoc(messageDocRef, { status: "read" }) as Promise<void>);
        }
    });

    await Promise.all(updatePromises);
};

// Listen for messages in real-time
export const listenForMessages = (chatId: string, setMessages: (messages: Message[]) => void) => {
    const chatRef = collection(db, "chats", chatId, "messages");
    const unsubscribe = onSnapshot(chatRef, 
        (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as Message[];
            setMessages(messages);
        },
        (error) => {
            console.error("Error listening to messages:", error);
        }
    );
    return unsubscribe;
};

export const getAdminUser = async (): Promise<User | null> => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("isAdmin", "==", true));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data() as User;
        }
        return null;
    } catch (error) {
        console.error("Error getting admin user:", error);
        return null;
    }
};

export const createChat = async (user1Data: User, user2Data: User): Promise<string | null> => {
    try {
        const chatId = user1Data.uid < user2Data.uid
            ? `${user1Data.uid}-${user2Data.uid}`
            : `${user2Data.uid}-${user1Data.uid}`;

        const chatRef = doc(db, "chats", chatId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
            await setDoc(chatRef, {
                users: [user1Data, user2Data],
                lastMessage: "",
                lastMessageTimestamp: serverTimestamp(),
            });
            return chatId;
        }
        return chatId;
    } catch (error) {
        console.error("Error creating chat:", error);
        return null;
    }
};

export const initializeAdminChats = async (adminData: User): Promise<void> => {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const chatPromises: Promise<string | null>[] = [];
        querySnapshot.forEach((docSnapshot: any) => {
            const userData = docSnapshot.data() as User;
            if (userData.uid !== adminData.uid) {
                chatPromises.push(createChat(adminData, userData));
            }
        });

        await Promise.all(chatPromises);
        console.log("Admin chats initialized with all users");
    } catch (error) {
        console.error("Error initializing admin chats:", error);
    }
};

export const initializeUserChatWithAdmin = async (userData: User): Promise<void> => {
    try {
        const adminData = await getAdminUser();
        if (adminData) {
            await createChat(userData, adminData);
            console.log("Chat initialized with admin");
        }
    } catch (error) {
        console.error("Error initializing chat with admin:", error);
    }
};

export { auth, db, storage };

