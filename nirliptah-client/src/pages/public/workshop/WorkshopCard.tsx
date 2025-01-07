import React from "react";
import { Badge } from "@/pages/components/ui/badge.tsx";
import { Button } from "@/pages/components/ui/button.tsx";
// import { format, parseISO, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface WorkshopCardProps {
    workshop: any; // Replace `any` with a proper type or interface for the workshop
    categories: any[]; // The list of categories
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, categories }) => {
    const navigate = useNavigate(); // Hook to navigate
    // const startDate = workshop.start_date;
    // const endDate = workshop.end_date;
    //
    // const formattedStartDate = startDate
    //     ? format(parseISO(startDate), "dd.MM.yyyy")
    //     : "Unknown";
    // const formattedEndDate = endDate
    //     ? format(parseISO(endDate), "dd.MM.yyyy")
    //     : "Unknown";
    //
    // const numberOfDays = startDate && endDate
    //     ? differenceInDays(parseISO(endDate), parseISO(startDate))
    //     : 0;

    // Find the category name from categories
    const category = categories.find((cat) => cat._id === workshop.category._id);
    const categoryName = category ? category.name : "Unknown";

    // Function to handle the navigation to the workshop details page
    const handleDetailsClick = () => {
        navigate(`/workshops/${workshop._id}`); // Navigate to the workshop details page
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
                        className="bg-[#9B6763] text-white py-2 px-6 rounded hover:bg-[#7B4F4C] transition"
                        onClick={handleDetailsClick} // Handle click to navigate
                    >
                        View Details
                    </Button>
                    <span className="text-sm font-semibold text-gray-800">
                        {workshop.price === 0 ? "Free" : `AU$ ${workshop.price || "TBD"}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WorkshopCard;
