import React from "react";
import { Link } from "react-router-dom";
import { FaHammer, FaHome, FaUsers } from "react-icons/fa";
import {FaBookBookmark, FaCreditCard} from "react-icons/fa6";

const sidelinks = [
    { title: "Dashboard", href: "/admin/home", icon: <FaHome /> },
    { title: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
    { title: "Users", href: "/admin/users", icon: <FaUsers /> },

    { title: "Enrollments", href: "/admin/enrollments", icon: <FaBookBookmark /> },
    { title: "Payments", href: "/admin/payments", icon: <FaCreditCard /> },

];

const AdminSidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = React.useState(true);

    // Handle sidebar toggle
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside
            className={`bg-[#9B6763] text-white h-screen flex flex-col transition-all duration-300 ${
                isCollapsed ? "w-16" : "w-48"
            }`}
            onClick={toggleSidebar} // Toggle sidebar on click
        >
            <nav className="space-y-2 mt-8">
                {sidelinks.map((link) => (
                    <div key={link.title}>
                        <Link
                            to={link.href}
                            onClick={(e) => e.stopPropagation()} // Prevent toggling sidebar on link click
                            className={`flex items-center p-3 space-x-3 rounded hover:bg-[#B8978C] transition-all duration-200 ${
                                isCollapsed ? "justify-center" : "justify-start"
                            }`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {!isCollapsed && <span>{link.title}</span>}
                        </Link>

                        {/*/!* Submenu for Retreats *!/*/}
                        {/*{link.subLinks && !isCollapsed && (*/}
                        {/*    <div className="ml-4 space-y-2">*/}
                        {/*        {link.subLinks.map((subLink) => (*/}
                        {/*            <Link*/}
                        {/*                key={subLink.title}*/}
                        {/*                to={subLink.href}*/}
                        {/*                onClick={(e) => e.stopPropagation()} // Prevent toggling sidebar on subLink click*/}
                        {/*                className="flex items-center p-3 space-x-3 rounded hover:bg-[#B8978C] transition-all duration-200"*/}
                        {/*            >*/}
                        {/*                <span className="text-xl">{subLink.icon}</span>*/}
                        {/*                <span>{subLink.title}</span>*/}
                        {/*            </Link>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
