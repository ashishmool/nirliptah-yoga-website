import React from "react";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaHammer, FaHome, FaSuitcase, FaUsers } from "react-icons/fa";
import { FaBookBookmark, FaPersonPraying } from "react-icons/fa6";

const sidelinks = [
    { title: "Dashboard", href: "/admin/home", icon: <FaHome /> },
    { title: "Instructors", href: "/admin/instructors", icon: <FaChalkboardTeacher /> },
    { title: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
    { title: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
    { title: "Retreats", href: "/admin/retreats", icon: <FaSuitcase /> },
    // {
    //     title: "Retreats",
    //     href: "/admin/retreats",
    //     icon: <FaSuitcase />,
    //     subLinks: [
    //         { title: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
    //     ],
    // },
    { title: "Yoga Poses", href: "/admin", icon: <FaPersonPraying /> },
    { title: "Bookings", href: "/admin/bookings", icon: <FaBookBookmark /> },
    { title: "Users", href: "/admin/users", icon: <FaUsers /> },
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
                isCollapsed ? "w-16" : "w-64"
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
