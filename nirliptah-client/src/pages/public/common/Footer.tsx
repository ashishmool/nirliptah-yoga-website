import { Link } from "react-router-dom";

// ICON
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
    // Scroll top when clicking on Link
    function scrollTopFunc() {
        window.scrollTo({
            top: -10,
            behavior: "instant",
        });
    }

    return (
        <footer className="bg-[#B8978C] text-white w-full">
            {/* Top Section */}
            <div className="flex flex-col lg:flex-row items-start justify-between px-4 md:px-6 py-10 mx-auto max-w-7xl">
                {/* Left Section */}
                <div className="flex-1 lg:pr-10">
                    <div className="info text-center lg:text-left w-full text-sm">
                        <ul>
                            <li className="mb-5 max-w-fit mx-auto lg:mx-0">
                                <Link onClick={scrollTopFunc} to="/">
                                    <img
                                        src="src/assets/logo-white.svg"
                                        className="h-20 w-40 text-white"
                                        alt="Logo"
                                    />
                                </Link>
                            </li>

                            <li className="text-gray-200">Address</li>
                            <li>Somewhere in, Australia</li>

                            <br />

                            <li className="text-gray-200">Contact</li>
                            <li>
                                <Link
                                    onClick={scrollTopFunc}
                                    to="mailto:hello@nirlipta-yoga.com.au"
                                >
                                    hello@nirlipta-yoga.com.au
                                </Link>
                            </li>
                            <li>+971 4 347 8089</li>

                            <br />

                            <li className="text-gray-200">
                                <div className="flex space-x-4 my-3 justify-center lg:justify-start">
                                    <Link
                                        onClick={scrollTopFunc}
                                        className="text-white hover:text-black"
                                        target="_blank"
                                        to="https://np.linkedin.com/in/ashish-mool"
                                    >
                                        <FaLinkedin className="h-7 w-7" />
                                    </Link>
                                    <Link
                                        onClick={scrollTopFunc}
                                        className="text-white hover:text-black"
                                        target="_blank"
                                        to="https://github.com//ashishmool/emirates-elegance"
                                    >
                                        <FaGithub className="h-7 w-7" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="flex-1 mt-24">
                    <div className="text-center lg:text-left">
                        <p className="text-gray-200 mb-4 font-semibold">Quick Links</p>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-white hover:text-black"
                                    to="/about"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-white hover:text-black"
                                    to="/services"
                                >
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-white hover:text-black"
                                    to="/contact"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-white hover:text-black"
                                    to="/blog"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Section */}
                <div className="text-sm lg:justify-end justify-center mt-5 lg:mt-0 flex-1">
                    <div className="text-center mt-24">
                        {/* Payment Options Title */}
                        <p className="text-gray-200 mb-4 font-semibold">Payment Options</p>

                        {/* Payment Icons */}
                        <div className="flex justify-center items-center space-x-4">
                            <img
                                className="h-8 w-auto"
                                src="https://www.iconarchive.com/download/i76280/designbolts/credit-card-payment/Visa.ico"
                                alt="Visa"
                            />
                            <img
                                className="h-6 w-auto"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png"
                                alt="MasterCard"
                            />
                            <img
                                className="h-4 w-auto"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1200px-PayPal_logo.svg.png"
                                alt="PayPal"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="py-6 px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
                    {/* Brand and Copyright */}
                    <div className="flex items-center space-x-4 text-center lg:text-left">
                        <span className="text-sm">© {new Date().getFullYear()} All Rights Reserved</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center text-center justify-center space-x-4 text-xs mt-4 lg:mt-0">
                        <Link
                            onClick={scrollTopFunc}
                            className="text-white hover:text-black"
                            to="/policies#Privacy"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            onClick={scrollTopFunc}
                            className="text-white hover:text-black"
                            to="/policies#Terms"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            onClick={scrollTopFunc}
                            className="text-white hover:text-black"
                            to="/policies#Cookies"
                        >
                            Cookies Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
