import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

// Material UI
import Divider from '@mui/material/Divider';

// Icons
import bellIcon from "../assets/icons/bell.png";
import userIcon from "../assets/icons/user.png";
import downArrowIcon from "../assets/icons/down-arrow.png";
import DownArrow from "../assets/svg/down-arrow.svg?react";

export default function MainLayout() {
  const navigate = useNavigate();

  // State
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
  const [isWorkSummaryReportOpen, setIsWorkSummaryReportOpen] = useState(false);
  const [isSubBasicInfoClick, setIsSubBasicInfoClick] = useState(false);
  const [isSubWorkSummaryReportClick, setIsSubWorkSummaryReportClick] = useState(false);

  // Ref
  const menuBasicInfoRef = useRef<HTMLLIElement>(null);
  const menuWorkSummaryReportRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuBasicInfoRef.current && !menuBasicInfoRef.current.contains(event.target as Node)) {
        setIsBasicInfoOpen(false);
      }
      if (menuWorkSummaryReportRef.current && !menuWorkSummaryReportRef.current.contains(event.target as Node)) {
        setIsWorkSummaryReportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const basicClick = localStorage.getItem("isSubBasicInfoClick") === "true";
    const workClick = localStorage.getItem("isSubWorkSummaryReportClick") === "true";
    const lastPath = localStorage.getItem("path");

    setIsSubBasicInfoClick(basicClick);
    setIsSubWorkSummaryReportClick(workClick);

    if (location.pathname === "/worker-info/manage-worker") {
      setIsSubBasicInfoClick(true);
    }
    else {
      if (lastPath) {
        navigate(`/${lastPath}`);
      }
    }
  }, [navigate]);

  const handleMenuSelect = (menu: "basic" | "work", path: string) => {
    setIsBasicInfoOpen(false);
    setIsWorkSummaryReportOpen(false);

    setIsSubBasicInfoClick(menu === "basic");
    setIsSubWorkSummaryReportClick(menu === "work");

    localStorage.setItem("isSubBasicInfoClick", menu === "basic" ? "true" : "false");
    localStorage.setItem("isSubWorkSummaryReportClick", menu === "work" ? "true" : "false");
    localStorage.setItem("path", path);
  };

  const handleDashBoardClick = () => {
    ClearAll();
  };

  const handleManageScheduleClick = () => {
    ClearAll();
  };

  const ClearAll = () => {
    setIsSubBasicInfoClick(false);
    setIsBasicInfoOpen(false);
    setIsWorkSummaryReportOpen(false);
    setIsSubWorkSummaryReportClick(false);
    localStorage.setItem("isSubBasicInfoClick", "false");
    localStorage.setItem("isSubWorkSummaryReportClick", "false");
    localStorage.setItem("path", "");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#071C3B] to-[#134CA1] text-white px-6 h-[70px] shadow-md flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex gap-5">
          <div className="flex justify-center items-center">
            <img src={"/logo.png"} alt="Logo" className="h-[60px] w-[71px]" />
          </div>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#F4F9FE"}} />
        </div>
        <ul className="flex justify-center items-center gap-6">
          <li>
            <NavLink
              to="/dashboard"
              onClick={handleDashBoardClick}
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-white hover:text-yellow-400'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li ref={menuWorkSummaryReportRef} className="relative">
            <button
              onClick={() => setIsWorkSummaryReportOpen((prev) => !prev)}
              className={`flex justify-center items-center gap-1 border-b-2 border-transparent focus:outline-none
                ${isSubWorkSummaryReportClick ? "border-yellow-400 text-yellow-400" : "border-transparent text-white hover:text-yellow-400"}  
              `}
            >
              <span>ผลการผลปฏิบัติงาน</span>
              <DownArrow
                width={14}
                height={14}
                style={{
                  fill: isSubWorkSummaryReportClick ? "#FFB300" : "#FFFFFF",
                  transition: "fill 0.3s ease, transform 0.3s ease",
                  transform: isWorkSummaryReportOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown Submenu */}
            {isWorkSummaryReportOpen && (
              <ul className="absolute left-0 mt-2 w-[180px] z-[20] bg-gradient-to-r from-[#071C3B] to-[#134CA1] text-white shadow-lg">
                <li>
                  <NavLink
                    to="/manage-work-report"
                    onClick={() => handleMenuSelect("work", "manage-work-report")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-[#133462]" : ""
                      }`
                    }
                  >
                    รายงานการปฏิบัติงาน
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/event"
                    onClick={() => handleMenuSelect("work", "event")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-black" : ""
                      }`
                    }
                  >
                    รายงานเหตุการณ์
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/manage-work-schedule"
              onClick={handleManageScheduleClick}
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-white hover:text-yellow-400'
                }`
              }
            >
              จัดการตารางทำงาน
            </NavLink>
          </li>
          <li ref={menuBasicInfoRef} className="relative">
            <button
              onClick={() => setIsBasicInfoOpen((prev) => !prev)}
              className={`flex justify-center items-center gap-1 border-b-2 border-transparent focus:outline-none
                ${isSubBasicInfoClick ? "border-yellow-400 text-yellow-400" : "border-transparent text-white hover:text-yellow-400"}  
              `}
            >
              <span>จัดการข้อมูลพื้นฐาน</span>
              <DownArrow
                width={14}
                height={14}
                style={{
                  fill: isSubBasicInfoClick ? "#FFB300" : "#FFFFFF",
                  transition: "fill 0.3s ease, transform 0.3s ease",
                  transform: isBasicInfoOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown Submenu */}
            {isBasicInfoOpen && (
              <ul className="absolute left-0 mt-2 w-[210px] z-[20] bg-gradient-to-r from-[#071C3B] to-[#134CA1] text-white shadow-lg">
                <li>
                  <NavLink
                    to="/worker-info"
                    onClick={() => handleMenuSelect("basic", "worker-info")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-[#133462]" : ""
                      }`
                    }
                  >
                    ข้อมูลผู้ปฏิบัติงาน
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/patrol-info"
                    onClick={() => handleMenuSelect("basic", "patrol-info")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-black" : ""
                      }`
                    }
                  >
                    ข้อมูลสายตรวจ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/manage-patrol"
                    onClick={() => handleMenuSelect("basic", "manage-patrol")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-black" : ""
                      }`
                    }
                  >
                    จัดการสายตรวจ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/workplace-info"
                    onClick={() => handleMenuSelect("basic", "workplace-info")}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm hover:bg-yellow-500 hover:text-black ${
                        isActive ? "bg-yellow-400 text-black" : ""
                      }`
                    }
                  >
                    ข้อมูลสถานที่ปฏิบัติงาน (Site)
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-white hover:text-yellow-400'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex justify-center items-center gap-1">
                  <span>จัดการผู้ใช้งานระบบ</span>
                  <DownArrow
                    width={14}
                    height={14}
                    style={{
                      fill: isActive ? '#FFB300' : '#FFFFFF',
                      transition: 'fill 0.3s ease',
                    }}
                  />
                </div>
              )}
            </NavLink>
          </li>
        </ul>
        <div className="flex justify-between items-center gap-7">
          {/* Notification Icon */}
          <div className="relative flex justify-center items-center">
            <img src={bellIcon} alt="Notifications" className="h-[23px] w-[19px]" />
            <div className="absolute -bottom-2 -right-[12px] bg-[#F6C643] text-white text-xs font-bold rounded-full w-[22px] h-[22px] flex justify-center items-center">
              <span className="text-[#071C3B]">12</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            {/* User Icon */}
            <div className="relative flex justify-center items-center bg-gradient-to-b from-[#F4F9FE] to-[#929598] rounded-full w-[51px] h-[51px]">
              <div className="relative flex justify-center items-center bg-gradient-to-b from-[#F6C643] to-[#887527] rounded-full w-[45px] h-[45px]">
                <img src={userIcon} alt="User Icon" className="rounded-full w-[40px] h-[40px]"/>
              </div>
            </div>
            {/* User Name */}
            <div className="flex flex-col justify-center items-start gap-1">
              <span className="text-base">ปกป้อง เก่งกล้าหาญ</span>
              <span className="text-sm font-semibold text-[#F6C643]">เจ้าหน้าที่ศูนย์ข้อมูลกลาง</span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img src={downArrowIcon} alt="Down Icon" className="w-[17px] h-[17px]" />
          </div>
        </div>
      </nav>

      {/* Main contents */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 pt-[85px]">
        <Outlet />
      </main>
    </div>
  );
}
