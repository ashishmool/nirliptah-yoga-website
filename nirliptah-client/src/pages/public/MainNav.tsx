import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/pages/components/ui/button.tsx";
import { FaBars, FaTimes } from "react-icons/fa";
// import { CgLogOut } from "react-icons/cg";
import Login from "@/pages/auth/Login.tsx";
import Logo from "../../assets/logo-main.svg";
import { AuthContext } from "@/context/AuthContext.tsx";
import { toast } from "sonner";
import { useLoginModal } from '@/context/LoginModalContext';

export default function MainNav() {

    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { info, setInfo } = useContext(AuthContext);
    const { isDialogOpen, setIsDialogOpen } = useLoginModal(); // Get state from LoginModalContext

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -96; // Adjust for mt-24 (96px)
            const yPosition = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: yPosition, behavior: "smooth" });
        }
    };

    const navigate = useNavigate();

    return (
        <div className="fixed min-w-full z-50">
            <nav
                className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-6"}`}
            >
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-full">
                    {/* Logo */}
                    <Link onClick={() => handleScrollToSection("journey")} to="/" className="mr-3 w-1/8">
                        <img
                            src={Logo}
                            className={`w-32 h-auto transition-all duration-300 ${isScrolled ? "w-20" : "w-24"}`}
                            alt="Nirlipta Yoga"
                        />
                    </Link>

                    {/* Hamburger Menu */}
                    <button
                        className="lg:hidden text-gray-700 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Main Menu (centered) */}
                    <div className={`lg:flex lg:items-center ${isMobileMenuOpen ? "block" : "hidden"} lg:mx-auto`}>
                        <div className="flex-6 flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                            {info?.role === "admin" && (
                                <Link to="/admin/home" className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                    Dashboard
                                </Link>
                            )}

                            {/* Show only if on Home Page ("/") */}
                            {isHomePage ? (
                                <>
                                    <button onClick={() => handleScrollToSection("workshops")} className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        Workshops
                                    </button>
                                    <button onClick={() => handleScrollToSection("contact-us")} className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        Contact
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        Home
                                    </Link>
                                    <Link to="/update-profile" className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        Update Profile
                                    </Link>
                                    <Link to="/my-enrollments" className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        My Enrollments
                                    </Link>
                                    <Link to="/my-schedule" className="text-gray-800 hover:text-[#9B6763] text-base font-medium">
                                        My Schedule
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>


                    {/* User Info and Avatar Section */}
                    <div className="flex items-center space-x-4">
                        {info?.email && (
                            <div className="flex flex-col">
                                {/* Small text: "Logged in as:" */}
                                <span className="text-xs text-gray-500">Logged in as:</span>
                                <p className="text-sm text-gray-800">{info?.email}</p>
                            </div>
                        )}

                        {info?.photo && info?.email && (
                            <div className="dropdown dropdown-end">
                                <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User Avatar"
                                            src={info?.photo
                                                ? info?.photo.includes('/uploads/user_photos/')
                                                    ? `http://localhost:5000${info?.photo}`
                                                    : `http://localhost:5000/uploads/${info?.photo}`
                                                : "/default-avatar.png"
                                            }
                                        />
                                    </div>
                                </button>
                                {/* Dropdown Menu */}
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow"
                                >
                                    {info?.email && (
                                        <>
                                            <li>
                                                <Link to="/update-profile" onClick={() => document.activeElement?.blur()}>
                                                    Update Profile
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/my-enrollments" onClick={() => document.activeElement?.blur()}>
                                                    My Enrollments
                                                </Link>
                                            </li>

                                            <li>
                                                <Link to="/my-schedule" onClick={() => document.activeElement?.blur()}>
                                                    My Schedule
                                                </Link>
                                            </li>

                                            <li>
                                                <button
                                                    onClick={() => {
                                                        localStorage.clear();
                                                        setInfo({ email: "", role: "" });
                                                        toast.success("Logged Out Successfully!");
                                                        window.location.href = "/";
                                                        document.activeElement?.blur(); // Close dropdown
                                                    }}
                                                    className="text-red-500"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </ul>


                            </div>
                        )}

                        {/* Login Button */}
                        <div>
                            {!info?.email || !info?.role ? (
                                <Button onClick={() => setIsDialogOpen(true)} className="bg-[#9B6763] text-sm">
                                    Login
                                </Button>
                            ) : null} {/* Only show Login button if not logged in */}
                        </div>
                    </div>


                </div>
            </nav>

            {/* Login Modal */}
            {isDialogOpen && <Login onClose={() => setIsDialogOpen(false)} />}
        </div>
    );
}
