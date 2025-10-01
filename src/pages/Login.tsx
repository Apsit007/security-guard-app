// src/pages/Login.tsx
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

export default function LoginPage() {
    const dispatch = useDispatch();

    const handleLogin = () => {
        // mock login
        dispatch(login({ token: "demo-token" }));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-96">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
                    Security Guard System
                </h1>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border rounded px-3 py-2 mb-4 focus:ring focus:ring-blue-300"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2 mb-6 focus:ring focus:ring-blue-300"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
