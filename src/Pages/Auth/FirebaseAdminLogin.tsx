import React, { useState } from "react";
import { FaUserShield, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';

const FirebaseAdminLogin: React.FC = () => {
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
        <section className="flex flex-col justify-center items-center h-screen bg-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-full max-w-md flex flex-col justify-center items-center border border-slate-700 z-10">
                <div className="mb-8 text-center">
                    <img src={logo} alt="FlowTap" className="h-10 mx-auto mb-4" />
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <FaUserShield className="text-white text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-slate-400">Secure access for administrators</p>
                </div>

                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                onChange={handleChangeUserData}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="admin@company.com"
                            />
                            <FaUserShield className="absolute left-3 top-3.5 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                onChange={handleChangeUserData}
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
                                placeholder="••••••••"
                            />
                            <FaLock className="absolute left-3 top-3.5 text-slate-500" />
                        </div>
                    </div>
                </div>

                <div className="w-full mt-8">
                    <button
                        disabled={isLoading}
                        onClick={handleAuth}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span>Verifying...</span>
                        ) : (
                            <>
                                <span>Access Dashboard</span>
                                <FaUserShield />
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center space-y-2">
                    <button onClick={() => navigate('/firebase/login')} className="text-slate-400 hover:text-white text-sm transition-colors block w-full">
                        Return to User Login
                    </button>
                    <p className="text-slate-500 text-xs mt-4">
                        Need an admin account?{" "}
                        <button onClick={() => navigate('/firebase/admin/register')} className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                            Create Admin Account
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FirebaseAdminLogin;
