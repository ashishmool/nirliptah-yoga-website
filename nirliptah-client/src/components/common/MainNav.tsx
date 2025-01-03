import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaBars, FaTimes, FaGithub, FaInstagram } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import Login from "../auth/Login";
import Logo from "/images/logo-main.svg";
import { AuthContext } from "@/context/AuthContext.tsx";
import {toast} from "sonner";

export default function MainNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    const { info, setInfo } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (token && email && role) {
            setInfo({email, role});
        }
    }, []);


    // Handle scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setInfo({email: "", role: ""});
        toast.success("Logged Out Successfully!");
        navigate ('/');
    };


    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.classList.toggle("overflow-hidden", !isMobileMenuOpen);
    };

    return (
        <div className="fixed min-w-full z-50">
            <nav
                className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}
            >
                <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="mr-3 w-1/8">
                        <img src={Logo} className="w-24 h-auto" alt="Nirlipta Yoga" />
                    </Link>

                    {/* Hamburger Icon */}
                    <button
                        className="lg:hidden text-gray-700 focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    {/* Main Navigation */}
                    <div className={`lg:flex lg:items-center ${isMobileMenuOpen ? "block" : "hidden"} w-5/8`}>
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                            <Link
                                to="/workshops"
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Workshops
                            </Link>
                            <Link
                                to="/retreats"
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Retreats
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Nirlipta
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Social Icons Section */}
                    <div className="flex space-x-6 items-center">
                        <a
                            href="https://github.com/ashishmool/nirlipta-yoga"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-gray-500"
                        >
                            <FaGithub size={24} />
                        </a>
                        <a
                            href="https://www.instagram.com/yogawithnivedita/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-pink-500"
                        >
                            <FaInstagram size={24} />
                        </a>
                    </div>


                    {/* Login/Logout Button */}
                    {info?.email && info?.role && (
                        <div className="text-gray-800 text-sm">{`${info?.email} (${info?.role})`}</div>
                    )}
                    <div className="mt-4 lg:mt-0 w-2/8">
                        {info?.email && info?.role ? (
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="text-[#9B6763] text-base font-sm"
                            >
                                <CgLogOut className="mr-2" />
                                Log Out
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                className="bg-[#9B6763] text-sm"
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Login Modal */}
            {isDialogOpen && (
                <Login
                    onClose={() => setIsDialogOpen(false)}
                    onLoginSuccess={() => {
                        setIsDialogOpen(false);
                    }}
                />
            )}
        </div>
    );
}
