// src/layouts/MainLayout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <nav className="bg-blue-900 text-white flex items-center px-6 h-14 shadow-md">
                <div className="font-bold text-lg mr-8">Security Guard</div>
                <ul className="flex gap-6">
                    <li>
                        <NavLink to="/dashboard" className="hover:text-yellow-400">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports" className="hover:text-yellow-400">
                            Reports
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className="hover:text-yellow-400">
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Main contents */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                <Outlet />
            </main>
        </div>
    );
}
