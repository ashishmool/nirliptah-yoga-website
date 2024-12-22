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

    const { info, setInfo } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (token && email && role) {
            setInfo({ email, role });
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
        setInfo({ email: "", role: "" });
        toast.success("Logged Out Successfully!");
    };


    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.classList.toggle("overflow-hidden", !isMobileMenuOpen);
    };

    return (
        <div className="absolute min-w-full z-50">
            <nav
                className={`absolute top-0 left-32 right-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-transparent" : "bg-transparent"}`}
            >
                <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">


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


                        </div>
                    </div>

                    {/* Social Icons Section */}
                    <div className="flex space-x-6 items-center">


                    </div>

                    {/* Logo */}
                    <Link to="/" className="mr-3 w-1/8">
                        <img src={Logo} className="w-32 h-auto ml-32" alt="Nirlipta Yoga" />
                    </Link>

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
