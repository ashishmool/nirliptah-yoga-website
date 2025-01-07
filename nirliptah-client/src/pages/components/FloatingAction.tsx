import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const FloatingAction: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Handle scroll event to toggle visibility of the button
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    // Scroll to top when button is clicked
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Smooth scrolling effect
        });
    };

    return (
        <div>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-[#9B6763] text-white p-3 rounded-full shadow-lg hover:bg-[#7b5050] focus:outline-none"
                >
                    <FaArrowUp className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default FloatingAction;
