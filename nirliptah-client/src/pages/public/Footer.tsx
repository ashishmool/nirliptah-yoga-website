import { Link } from "react-router-dom";

// ICON
import { FaLinkedin, FaGithub } from "react-icons/fa";

import { toast } from "sonner"; // Import the toast library
import logoMain from "../../assets/logo-main.svg";



export default function Footer() {
    // Scroll top when clicking on Link
    function scrollTopFunc() {
        window.scrollTo({
            top: -10,
            behavior: "instant",
        });
    }

    function handleSubscription() {
        const emailInput = document.querySelector(".subscription-input");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation

        if (emailInput && emailInput.value) {
            if (emailRegex.test(emailInput.value)) {
                // Example success notification
                toast.success(`Successfully subscribed with ${emailInput.value}!`);

                // Clear the input after subscription
                emailInput.value = "";

                // Add logic here to call your backend or API to handle the subscription
            } else {
                // Example error notification for invalid email format
                toast.error("Please enter a valid email address.");
            }
        } else {
            // Example error notification for empty input
            toast.error("Please enter an email address.");
        }
    }


    return (
        <footer
            className="w-full text-white bg-cover bg-center bg-no-repeat bg-[url('/src/assets/footer.svg')]"
        >
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 md:px-6 py-24 mx-auto max-w-7xl space-y-12 lg:space-y-0">
                {/* Left Section */}
                <div className="flex-1 text-center lg:text-left">
                    <Link onClick={scrollTopFunc} to="/">
                        <img
                            src={logoMain}
                            className="h-16 w-24 mx-auto lg:mx-0"
                            alt="Logo"
                        />
                    </Link>
                    <div className="info text-[#A38F85] text-sm mt-4">
                        <ul>
                            <li>Address</li>
                            <li>Somewhere in, Australia</li>
                            <br />
                            <li>Contact</li>
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
                            <li className="flex justify-center lg:justify-start space-x-4 my-3">
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-[#A38F85] hover:text-[#9B6763]"
                                    target="_blank"
                                    to="https://np.linkedin.com/in/ashish-mool"
                                >
                                    <FaLinkedin className="h-7 w-7" />
                                </Link>
                                <Link
                                    onClick={scrollTopFunc}
                                    className="text-[#A38F85] hover:text-[#9B6763]"
                                    target="_blank"
                                    to="https://github.com/ashishmool/nirliptah-yoga-website.git"
                                >
                                    <FaGithub className="h-7 w-7" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="flex-1 text-center lg:text-left">
                    <p className="text-[#9B6763] mb-4 font-semibold">Explore</p>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                onClick={scrollTopFunc}
                                className="text-[#A38F85] hover:text-black"
                                to="/about"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={scrollTopFunc}
                                className="text-[#A38F85] hover:text-black"
                                to="/services"
                            >
                                Our Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={scrollTopFunc}
                                className="text-[#A38F85] hover:text-black"
                                to="/contact"
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                onClick={scrollTopFunc}
                                className="text-[#A38F85] hover:text-black"
                                to="/blog"
                            >
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="flex-1 text-center">
                    <p className="text-[#9B6763] mb-4 font-semibold">Stay Updated</p>
                    <div className="join">
                        <input
                            className="input input-bordered join-item subscription-input text-black"
                            placeholder="Email"
                        />
                        <button
                            onClick={handleSubscription}
                            className="btn join-item rounded-r-full"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="py-6 px-4 md:px-6 bg-opacity-90">
                <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto text-white space-y-4 lg:space-y-0">
                    {/* Brand and Copyright */}
                    <div className="text-center lg:text-left">
                <span className="text-sm">
                    © {new Date().getFullYear()} All Rights Reserved
                </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center space-x-4 text-xs">
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
