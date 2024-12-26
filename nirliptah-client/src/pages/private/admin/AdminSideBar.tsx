import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaHammer, FaHome, FaSuitcase, FaUsers } from "react-icons/fa";
import {FaBookBookmark, FaPeopleGroup, FaPersonPraying} from "react-icons/fa6";

const sidelinks = [
    { title: "Dashboard", href: "/admin/home", icon: <FaHome /> },
    { title: "Instructors", href: "/admin/instructors", icon: <FaChalkboardTeacher /> },
    { title: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
    {
        title: "Retreats", href: "/admin/retreats", icon: <FaSuitcase />,
        subLinks: [
            { title: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
        ]
    },
    { title: "Yoga Poses", href: "/admin", icon: <FaPersonPraying /> },
    { title: "Bookings", href: "/admin/bookings", icon: <FaBookBookmark /> },
    { title: "Users", href: "/admin/users", icon: <FaUsers /> },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    return (
        <aside className={`w-64 h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
            <div className="flex items-center justify-between p-4">
                {/* Collapse/Expand Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="btn btn-ghost text-white hover:bg-gray-700 transition-all"
                >
                    {isCollapsed ? (
                        <span className="text-lg">▶</span>
                    ) : (
                        <span className="text-lg">◀</span>
                    )}
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
                {sidelinks.map((link) => (
                    <div key={link.title}>
                        <Link
                            to={link.href}
                            className={`flex items-center p-3 space-x-3 rounded hover:bg-gray-700 transition-all duration-200 ${isCollapsed ? "justify-center" : "justify-start"}`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {!isCollapsed && <span>{link.title}</span>}
                        </Link>

                        {/* Submenu for Retreats */}
                        {link.subLinks && !isCollapsed && (
                            <div className="ml-4 space-y-2">
                                {link.subLinks.map((subLink) => (
                                    <Link
                                        key={subLink.title}
                                        to={subLink.href}
                                        className="flex items-center p-3 space-x-3 rounded hover:bg-gray-600 transition-all duration-200"
                                    >
                                        <span className="text-xl">{subLink.icon}</span>
                                        <span>{subLink.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
