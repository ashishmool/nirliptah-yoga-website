import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/pages/components/ui/button.tsx";
import { FaBars, FaTimes, FaGithub, FaInstagram } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import Login from "@/pages/private/auth/Login.tsx";
import Logo from "../../assets/logo-main.svg";
import { AuthContext } from "@/context/AuthContext.tsx";
import { toast } from "sonner";

export default function MainNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { info, setInfo } = useContext(AuthContext);


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


    return (
        <div className="fixed min-w-full z-50">
            <nav
                className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
                    isScrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-6"
                }`}
            >
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-full">
                    <Link to="/" className="mr-3 w-1/8">
                        <img
                            src={Logo}
                            className={`w-32 h-auto transition-all duration-300 ${
                                isScrolled ? "w-20" : "w-24"
                            }`}
                            alt="Nirlipta Yoga"
                        />
                    </Link>

                    <button
                        className="lg:hidden text-gray-700 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>

                    <div
                        className={`lg:flex lg:items-center ${
                            isMobileMenuOpen ? "block" : "hidden"
                        }`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                            {info?.role === "admin" && (
                                <Link
                                    to="/admin/home"
                                    className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => handleScrollToSection("workshops")}
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                            >
                                Workshops
                            </button>
                            <button
                                onClick={() => handleScrollToSection("retreats")}
                                className="text-gray-800 hover:text-[#9B6763] text-base font-medium"
                            >
                                Retreats
                            </button>

                        </div>
                    </div>

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

                    <div className="mt-4 lg:mt-0">
                        {info?.email && info?.role ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    localStorage.clear();
                                    setInfo({ email: "", role: "" });
                                    toast.success("Logged Out Successfully!");
                                }}
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
            {isDialogOpen && <Login onClose={() => setIsDialogOpen(false)} />}
        </div>
    );
}
