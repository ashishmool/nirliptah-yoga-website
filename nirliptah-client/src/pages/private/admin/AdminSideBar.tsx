import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaHammer, FaHome, FaSuitcase, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { FaPeopleGroup, FaPersonPraying } from "react-icons/fa6";

const sidelinks = [
    { title: "Dashboard", href: "/admin/home", icon: <FaHome /> },
    { title: "Instructors", href: "/admin/instructors", icon: <FaChalkboardTeacher /> },
    { title: "Workshops", href: "/admin/workshops", icon: <FaHammer /> },
    { title: "Accommodations", href: "/admin/accommodations", icon: <FaHome /> },
    { title: "Retreats", href: "/admin/retreats", icon: <FaSuitcase /> },
    { title: "Yoga Poses", href: "/admin", icon: <FaPersonPraying /> },
    { title: "Partners", href: "/admin", icon: <FaPeopleGroup /> },
    { title: "Users", href: "/admin/users", icon: <FaUsers /> },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    onLogout: () => void;
    profilePicture: string;
    email: string;
}

const AdminSidebar: React.FC<SidebarProps> = ({
                                                  isCollapsed,
                                                  setIsCollapsed,
                                                  onLogout,
                                                  profilePicture,
                                                  email,
                                              }) => {
    console.log("Profile Picture::: ",profilePicture);
    return (
        <aside
            className={`${
                isCollapsed ? "w-16" : "w-64"
            } bg-gray-800 text-white h-screen transition-all duration-300 flex flex-col justify-between`}
        >
            {/* Collapse/Expand Button */}
            <div className="p-4">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-300 mb-4 w-full flex justify-center items-center hover:bg-gray-700 p-2 rounded"
                >
                    {isCollapsed ? (
                        <span className="text-lg">▶</span>
                    ) : (
                        <span className="text-lg">◀</span>
                    )}
                </button>

                {/* Profile Section */}
                <div className="mb-4 text-center">
                    {!isCollapsed && (
                        <>
                            <img
                                src={profilePicture || "default-profile-pic.jpg"} // Use a default image if profilePicture is missing
                                alt="Profile"
                                className={`rounded-full mx-auto ${
                                    isCollapsed ? "w-10 h-10" : "w-20 h-20"
                                }`}
                            />
                            <p className="mt-2 text-sm font-medium">{email}</p>
                        </>
                    )}
                </div>

                {/* Navigation Links */}
                <nav>
                    {sidelinks.map((link) => (
                        <Link
                            key={link.title}
                            to={link.href}
                            className={`flex items-center space-x-3 p-3 rounded hover:bg-gray-700 transition-all duration-200 ${
                                isCollapsed ? "justify-center" : "justify-start"
                            }`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {!isCollapsed && (
                                <span className="whitespace-nowrap">{link.title}</span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Profile Settings Section */}
            <div>
                <button
                    onClick={onLogout}
                    className="bg-gray-700 hover:bg-gray-600 p-3 text-white flex items-center justify-center rounded m-4"
                >
                    <span className="text-xl">
                        <FaSignOutAlt />
                    </span>
                    {!isCollapsed && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
