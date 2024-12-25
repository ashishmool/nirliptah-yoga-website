import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import AdminSidebar from "../admin/AdminSideBar";

const AdminDashboard: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("id");
    const [profilePicture, setProfilePicture] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/getById/${userId}`
                );
                setProfilePicture(response.data.profilePicture || "");
                setEmail(response.data.email || "");
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data.");
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleLogout = () => {
        // Clear localStorage and redirect
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                onLogout={handleLogout}
                profilePicture={profilePicture}
                email={email}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100">
                <header className="flex flex-col border-b border-gray-300 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    {email && (
                        <p className="text-sm text-gray-600 mt-2">Welcome, {email}</p>
                    )}
                </header>

                {/* Nested Routes */}
                <div className="flex flex-col h-[calc(100vh-200px)] bg-white shadow rounded-lg">
                    {/* Outlet */}
                    <div className="flex-1 p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
