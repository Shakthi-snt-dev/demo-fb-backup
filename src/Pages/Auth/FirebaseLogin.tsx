import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../assets/logo.png';

const FirebaseLogin: React.FC = () => {
    const [userData, setUserData] = useState({ email: "", password: "" });
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
            await signInWithEmailAndPassword(auth, userData?.email, userData?.password);
            navigate("/dashboard/messages");
        } catch (error: any) {
            console.log(error);
            alert(error.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex flex-col justify-center items-center h-screen bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>

            <div className="bg-white/80 backdrop-blur-sm shadow-2xl p-8 rounded-2xl w-full max-w-md flex flex-col justify-center items-center border border-slate-100 z-10">
                <div className="mb-8 text-center">
                    <img src={logo} alt="FlowTap" className="h-10 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to continue to your chat</p>
                </div>
                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChangeUserData}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChangeUserData}
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                <div className="w-full mt-6">
                    <button
                        disabled={isLoading}
                        onClick={handleAuth}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <FaSignInAlt />
                            </>
                        )}
                    </button>
                </div>
                <div className="mt-6 text-center space-y-2">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{" "}
                        <Link to="/firebase/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <p className="text-slate-400 text-xs">
                        <Link to="/firebase/admin/login" className="hover:text-slate-600 transition-colors">
                            Admin Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FirebaseLogin;
