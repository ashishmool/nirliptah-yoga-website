import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSideBar";
import AdminTopBar from "@/pages/private/admin/AdminTopBar.tsx";
import Breadcrumbs from "./Breadcrumbs"; // Import the Breadcrumbs component
import { FaHome, FaChalkboardTeacher, FaHammer, FaSuitcase, FaUsers } from "react-icons/fa";
import { FaPeopleGroup, FaPersonPraying } from "react-icons/fa6";

const AdminDashboard: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Define breadcrumbs items based on the current route
    const breadcrumbs = [
        { label: "Dashboard", href: "/admin/home", icon: <FaHome /> },
        { label: "Instructors", href: "/admin/instructors", icon: <FaChalkboardTeacher /> },
        { label: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
        { label: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
        { label: "Retreats", href: "/admin/retreats", icon: <FaSuitcase /> },
        { label: "Yoga Poses", href: "/admin/poses", icon: <FaPersonPraying /> },
        { label: "Partners", href: "/admin/partners", icon: <FaPeopleGroup /> },
        { label: "Users", href: "/admin/users", icon: <FaUsers /> }
    ];

    // Dynamically determine the breadcrumb items based on the current route
    const currentPath = window.location.pathname;
    const currentBreadcrumbs = breadcrumbs.filter(item => currentPath.includes(item.href));

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* TopBar */}
            <div className="h-16 w-full shadow-md bg-white">
                <AdminTopBar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                {/* Main Content */}
                <div className="flex-1 p-6 bg-gray-100 overflow-auto">

                    {/* Nested Routes */}
                    <div className="flex flex-col h-full bg-white shadow rounded-lg">
                        {/* Breadcrumbs */}
                        <div className="p-4">
                            <Breadcrumbs items={currentBreadcrumbs} />
                        </div>
                        {/* Outlet */}
                        <div className="flex-1 p-6 overflow-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
