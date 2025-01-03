import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext.tsx";
import { fetchUserById } from "../../../backend/services/userService";
import ThemeToggle from "../../components/ThemeToggle"; // Import ThemeToggle
import LightLogo from "../../../assets/logo-main.svg";
import DarkLogo from "../../../assets/logo-white.svg";

const AdminTopBar: React.FC = () => {
    const { info, setInfo } = useContext(AuthContext);
    const [userData, setUserData] = useState<any>(null);
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light"); // Track theme state
    const navigate = useNavigate();

    console.log("Get Context Photo:::",localStorage.getItem("photo"))
    // Fetch user data when `info._id` changes
    useEffect(() => {
        const fetchUserData = async () => {
            if (info._id) {
                try {
                    const user = await fetchUserById(info._id);
                    setUserData(user);
                } catch (error) {
                    toast.error("Failed to fetch user data.");
                }
            }
        };

        fetchUserData();
    }, [info._id]);

    // Synchronize theme with localStorage and the document
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");

        setInfo({email: "", role: "", user_id: "", photo: ""});
        toast.success("Logged Out Successfully!");
        navigate("/"); // Redirect to the home page
    };

    return (
        <div className="navbar bg-base-100 h-16 shadow-md">
            <div className="flex-1 flex items-center">
                {/* Dynamic Logo based on theme */}
                <Link to="/" className="mr-3">
                    <img
                        src={theme === "dark" ? DarkLogo : LightLogo}
                        className="w-32 h-auto mx-auto"
                        alt="Nirlipta Yoga"
                    />
                </Link>

                {/* Hamburger Menu (Dropdown) */}
                <div className="dropdown">
                    <button tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </button>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow"
                    >
                        <li><Link to="/homepage">Homepage</Link></li>
                        <li><Link to="/portfolio">Portfolio</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
            </div>

            <div className="flex-none flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle theme={theme} setTheme={setTheme} />

                {/* Notifications */}
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <span className="badge badge-xs" style={{ backgroundColor: "#9B6763" }}></span>
                    </div>
                </button>

                {/* Avatar and Dropdown Menu */}
                <div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User Avatar"
                                src={localStorage.getItem("photo") ? `http://localhost:5000${localStorage.getItem("photo")}` : "/default-avatar.png"}
                            />
                        </div>
                    </button>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow"
                    >
                        <li><Link to="/my-profile">Profile</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminTopBar;
