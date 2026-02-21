import React, { useState, useMemo } from "react";
import {Outlet, useLocation} from "react-router-dom";
import AdminSidebar from "../admin/AdminSideBar";
import AdminTopBar from "@/pages/private/admin/AdminTopBar.tsx";
import Breadcrumbs from "../../components/Breadcrumbs.tsx"; // Import the Breadcrumbs component
import { FaHome, FaChalkboardTeacher, FaHammer, FaSuitcase, FaUsers } from "react-icons/fa";
import { FaPeopleGroup, FaPersonPraying } from "react-icons/fa6";

const AdminDashboard: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation(); // Get the current location

    // Define breadcrumbs items based on the current route
    const breadcrumbs = [
        { label: "Dashboard", href: "/admin/home", icon: <FaHome /> },
        { label: "Retreats", href: "/admin/retreats", icon: <FaSuitcase /> },
        { label: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
        { label: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
        { label: "Users", href: "/admin/users", icon: <FaUsers /> }
    ];

    // Dynamically determine breadcrumbs based on current location
    const currentPath = location.pathname;
    const currentBreadcrumbs = useMemo(() => {
        const pathParts = currentPath.split("/").filter(Boolean);
        let accumulatedPath = "/admin";
        let breadcrumbList = [];

        // Map over static breadcrumbs and accumulate the path
        breadcrumbs.forEach(item => {
            if (currentPath.startsWith(item.href)) {
                breadcrumbList.push(item);
                accumulatedPath = item.href;
            }
        });

        // Handle nested routes like Add or Update
        if (pathParts.length > 2) {
            // Add last part of the path (e.g., "Add", "Update") to breadcrumbs
            const lastPart = pathParts[pathParts.length - 1];
            let label = lastPart.charAt(0).toUpperCase() + lastPart.slice(1); // Capitalize the first letter
            breadcrumbList.push({
                label: label,
                href: currentPath, // Full path for the "Add" or "Update" route
            });
        }

        return breadcrumbList;
    }, [currentPath]);

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
