// src/layouts/MainLayout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <nav className="bg-blue-900 text-white flex items-center px-6 h-14 shadow-md">
                <div className="font-bold text-lg mr-8">HR System</div>
                <ul className="flex gap-6">
                    <li>
                        <NavLink to="/dashboard" className="hover:text-yellow-400">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/personnel" className="hover:text-yellow-400">
                            จัดการบุคลากร
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/projects" className="hover:text-yellow-400">
                            จัดการโครงการ
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className="hover:text-yellow-400">
                            ตั้งค่า
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Main contents */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                <Outlet /> {/* จะเปลี่ยนเป็นแต่ละ page */}
            </main>
        </div>
    );
}
