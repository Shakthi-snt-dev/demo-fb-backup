import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, initializeAdminChats } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../assets/logo.png';

const FirebaseAdminRegister: React.FC = () => {
    const [userData, setUserData] = useState({ fullName: "", email: "", password: "", isAdmin: true });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAuth = async () => {
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData?.email, userData?.password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);

            const userDocument = {
                uid: user.uid,
                email: user.email,
                username: user.email?.split("@")[0]?.toLowerCase() || "",
                fullName: userData.fullName,
                image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
                isAdmin: true,
                status: "online",
            };

            await setDoc(userDocRef, userDocument);

            // Admin always initializes chats with all users
            await initializeAdminChats(userDocument);

            navigate("/dashboard/messages");
        } catch (error: any) {
            console.log(error);

            if (error.code === 'auth/email-already-in-use') {
                alert('This email is already registered. Please login instead or use a different email address.');
                navigate("/firebase/admin/login");
            } else if (error.code === 'auth/weak-password') {
                alert('Password is too weak. Please use at least 6 characters.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Invalid email address. Please enter a valid email.');
            } else {
                alert(error.message || 'An error occurred during registration. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col justify-center items-center h-screen bg-slate-900 relative overflow-hidden">
            {/* Decorative Background Elements - Darker for Admin */}
            <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>

            <div className="bg-slate-800/50 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-full max-w-md flex flex-col justify-center items-center border border-slate-700 z-10">
                <div className="mb-8 text-center">
                    <img src={logo} alt="FlowTap" className="h-10 mx-auto mb-4" />
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <FaUserShield className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Admin Account</h1>
                    <p className="text-slate-400">Set up your administrative access</p>
                </div>

                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            onChange={handleChangeUserData}
                            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChangeUserData}
                            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                            placeholder="admin@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChangeUserData}
                            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="w-full mt-8">
                    <button
                        disabled={isLoading}
                        onClick={handleAuth}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span>Creating Admin...</span>
                        ) : (
                            <>
                                <span>Register Admin</span>
                                <FaUserShield />
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-slate-400 text-sm">
                        Already have an admin account?{" "}
                        <Link to="/firebase/admin/login" className="text-blue-400 font-semibold hover:text-blue-300 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FirebaseAdminRegister;
