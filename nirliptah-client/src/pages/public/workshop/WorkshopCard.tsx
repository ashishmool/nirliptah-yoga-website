import React from "react";
import { Badge } from "@/pages/components/ui/badge.tsx";
import { Button } from "@/pages/components/ui/button.tsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLoginModal } from '../../../context/LoginModalContext'; // Import useLoginModal


interface WorkshopCardProps {
    workshop: any; // Replace `any` with a proper type or interface for the workshop
    categories: any[]; // The list of categories
    isEnrolled: boolean;

}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, categories, isEnrolled }) => {
    const navigate = useNavigate(); // Hook to navigate
    const { setIsDialogOpen } = useLoginModal(); // Get the setIsDialogOpen function from LoginModalContext

    // Find the category name from categories
    const category = categories.find((cat) => cat._id === workshop.category._id);
    const categoryName = category ? category.name : "Unknown";

    // Function to handle the navigation to the workshop details page
    const handleDetailsClick = () => {
        if (localStorage.getItem('token') == null) {
            console.log("Login Dialog Open Trigger Here!!!");
            setIsDialogOpen(true); // Open the login modal if not logged in
        } else {
            navigate(`/workshops/${workshop._id}`); // Navigate to the workshop details page if logged in
        }
    };

    return (
        <div className="workshop-card bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-80 md:w-96 h-[400px]">
            {/* Main Image */}
            <div className="relative">
                <img
                    src={`http://localhost:5000${workshop.photo || "fallback-image.png"}`}
                    alt={workshop.title}
                    className="w-full h-60 object-cover"
                />

                {/* Category Badge */}
                <Badge
                    className="absolute z-10 text-white rounded-none top-0"
                    style={{
                        backgroundColor: "#A38F85", // Custom background color
                        left: "50%", // Position at the center horizontally
                        transform: "translateX(-50%)", // Adjust to perfectly center the badge
                    }}
                >
                    {categoryName}
                </Badge>
            </div>

            {/* Workshop Details */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{workshop.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{workshop.description.slice(0, 90)}...</p>
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        className={`px-6 py-2 rounded ${
                            isEnrolled ? "bg-gray-400 cursor-not-allowed" : "bg-[#9B6763] hover:bg-[#7B4F4C] text-white"
                        }`}
                        onClick={handleDetailsClick}
                        disabled={isEnrolled}
                    >
                        {isEnrolled ? "Enrolled" : "View Details"}
                    </Button>
                    <span className="text-sm font-semibold text-gray-800">
    {workshop.discount_price && workshop.discount_price < workshop.price ? (
        <>
            <span className="line-through text-gray-500">AU$ {workshop.price}</span> {" "}
            <span className="text-red-600">AU$ {workshop.discount_price}</span>
        </>
    ) : (
        workshop.price === 0 ? "Free" : `AU$ ${workshop.price || "TBD"}`
    )}
</span>

                </div>
            </div>
        </div>
    );
};

export default WorkshopCard;
